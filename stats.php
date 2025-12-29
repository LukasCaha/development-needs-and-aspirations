<?php
// Security Configuration
define('MAX_SUBMISSIONS_PER_HOUR', 5);
define('MIN_SECONDS_BETWEEN_SUBMISSIONS', 10);
define('DUPLICATE_WINDOW_HOURS', 1);
define('MAX_FIELD_LENGTH', 255);
define('MAX_REQUEST_SIZE', 1024); // 1KB max request body
define('CSRF_TOKEN_EXPIRY', 3600); // 1 hour

// Only set headers if not running from CLI
if (php_sapi_name() !== 'cli') {
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

// Detect request method
$request_method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($request_method === 'OPTIONS') {
    exit(0);
}

$db_file = __DIR__ . '/quiz_stats.db';

// Helper Functions

/**
 * Get client IP address
 */
function getClientIp() {
    $ip_keys = ['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'REMOTE_ADDR'];
    foreach ($ip_keys as $key) {
        if (!empty($_SERVER[$key])) {
            $ip = $_SERVER[$key];
            // Handle comma-separated IPs (take first)
            if (strpos($ip, ',') !== false) {
                $ip = trim(explode(',', $ip)[0]);
            }
            // Validate IP
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }
    return '0.0.0.0';
}

/**
 * Validate and sanitize input data
 */
function validateAndSanitizeInput($data) {
    $errors = [];
    $sanitized = [];
    
    // Validate step1: Must be 'A', 'B', or 'C'
    if (!isset($data['step1']) || !in_array($data['step1'], ['A', 'B', 'C'], true)) {
        $errors[] = 'Invalid step1 value';
    } else {
        $sanitized['step1'] = $data['step1'];
    }
    
    // Validate step2: Must be '1', '2', or '3'
    if (!isset($data['step2']) || !in_array($data['step2'], ['1', '2', '3'], true)) {
        $errors[] = 'Invalid step2 value';
    } else {
        $sanitized['step2'] = $data['step2'];
    }
    
    // Validate step3: Must be 'X', 'Y', or 'Z'
    if (!isset($data['step3']) || !in_array($data['step3'], ['X', 'Y', 'Z'], true)) {
        $errors[] = 'Invalid step3 value';
    } else {
        $sanitized['step3'] = $data['step3'];
    }
    
    // Validate path: Must match pattern ^[ABC]-[123]-[XYZ]$
    if (!isset($data['path'])) {
        $errors[] = 'Missing path';
    } else {
        $path = trim($data['path']);
        if (!preg_match('/^[ABC]-[123]-[XYZ]$/', $path)) {
            $errors[] = 'Invalid path format';
        } else {
            $sanitized['path'] = $path;
        }
    }
    
    // Validate archetype: alphanumeric with spaces/hyphens, max length
    if (!isset($data['archetype'])) {
        $errors[] = 'Missing archetype';
    } else {
        $archetype = trim($data['archetype']);
        $archetype = preg_replace('/[^\w\s-]/', '', $archetype); // Remove invalid chars
        $archetype = substr($archetype, 0, MAX_FIELD_LENGTH);
        if (empty($archetype) || strlen($archetype) > MAX_FIELD_LENGTH) {
            $errors[] = 'Invalid archetype';
        } else {
            $sanitized['archetype'] = $archetype;
        }
    }
    
    // Validate analog: alphanumeric with spaces/hyphens, max length
    if (isset($data['analog'])) {
        $analog = trim($data['analog']);
        $analog = preg_replace('/[^\w\s-]/', '', $analog); // Remove invalid chars
        $analog = substr($analog, 0, MAX_FIELD_LENGTH);
        if (strlen($analog) > MAX_FIELD_LENGTH) {
            $errors[] = 'Invalid analog';
        } else {
            $sanitized['analog'] = $analog ?: null;
        }
    } else {
        $sanitized['analog'] = null;
    }
    
    return ['valid' => empty($errors), 'data' => $sanitized, 'errors' => $errors];
}

/**
 * Check rate limits for IP address
 */
function checkRateLimit($db, $ip) {
    $now = time();
    
    // Check submissions in last hour
    $stmt = $db->prepare("SELECT COUNT(*) as count FROM rate_limits WHERE ip_address = ? AND submission_time > datetime(?, '-1 hour')");
    $stmt->execute([$ip, date('Y-m-d H:i:s', $now)]);
    $hour_count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    if ($hour_count >= MAX_SUBMISSIONS_PER_HOUR) {
        return ['allowed' => false, 'reason' => 'Hourly limit exceeded'];
    }
    
    // Check minimum seconds between submissions
    $stmt = $db->prepare("SELECT submission_time FROM rate_limits WHERE ip_address = ? ORDER BY submission_time DESC LIMIT 1");
    $stmt->execute([$ip]);
    $last = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($last) {
        $last_time = strtotime($last['submission_time']);
        $seconds_since = $now - $last_time;
        if ($seconds_since < MIN_SECONDS_BETWEEN_SUBMISSIONS) {
            return ['allowed' => false, 'reason' => 'Too soon since last submission'];
        }
    }
    
    return ['allowed' => true];
}

/**
 * Check for duplicate submissions
 */
function checkDuplicateSubmission($db, $ip, $path) {
    $stmt = $db->prepare("SELECT COUNT(*) as count FROM recent_submissions WHERE ip_address = ? AND path = ? AND submission_time > datetime('now', '-' || ? || ' hours')");
    $stmt->execute([$ip, $path, DUPLICATE_WINDOW_HOURS]);
    $count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    if ($count > 0) {
        return ['allowed' => false, 'reason' => 'Duplicate submission detected'];
    }
    
    return ['allowed' => true];
}

/**
 * Record submission for rate limiting and duplicate detection
 */
function recordSubmission($db, $ip, $path) {
    $now = date('Y-m-d H:i:s');
    
    // Record in rate_limits
    $stmt = $db->prepare("INSERT INTO rate_limits (ip_address, submission_time, path) VALUES (?, ?, ?)");
    $stmt->execute([$ip, $now, $path]);
    
    // Record in recent_submissions
    try {
        $stmt = $db->prepare("INSERT INTO recent_submissions (ip_address, path, submission_time) VALUES (?, ?, ?)");
        $stmt->execute([$ip, $path, $now]);
    } catch (PDOException $e) {
        // Ignore unique constraint violations (shouldn't happen with our checks, but be safe)
    }
    
    // Cleanup old entries (older than 24 hours)
    $db->exec("DELETE FROM rate_limits WHERE submission_time < datetime('now', '-24 hours')");
    $db->exec("DELETE FROM recent_submissions WHERE submission_time < datetime('now', '-24 hours')");
}

/**
 * Generate CSRF token
 */
function generateCsrfToken($db, $ip) {
    $token = bin2hex(random_bytes(32));
    $expiry = date('Y-m-d H:i:s', time() + CSRF_TOKEN_EXPIRY);
    
    // Store token in database (cleanup old tokens first)
    $db->exec("DELETE FROM csrf_tokens WHERE expiry < datetime('now')");
    
    $stmt = $db->prepare("INSERT OR REPLACE INTO csrf_tokens (ip_address, token, expiry) VALUES (?, ?, ?)");
    $stmt->execute([$ip, $token, $expiry]);
    
    return $token;
}

/**
 * Validate CSRF token
 */
function validateCsrfToken($db, $ip, $token) {
    if (empty($token)) {
        return false;
    }
    
    // Cleanup expired tokens
    $db->exec("DELETE FROM csrf_tokens WHERE expiry < datetime('now')");
    
    $stmt = $db->prepare("SELECT token FROM csrf_tokens WHERE ip_address = ? AND token = ? AND expiry > datetime('now')");
    $stmt->execute([$ip, $token]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result) {
        // Delete used token (one-time use)
        $db->prepare("DELETE FROM csrf_tokens WHERE ip_address = ? AND token = ?")->execute([$ip, $token]);
        return true;
    }
    
    return false;
}

/**
 * Send error response
 */
function sendError($code, $message) {
    http_response_code($code);
    echo json_encode(['error' => $message]);
    exit;
}

try {
    // Use PDO instead of SQLite3
    $db = new PDO("sqlite:$db_file");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Initialize main results table
    $db->exec("CREATE TABLE IF NOT EXISTS quiz_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        step1 TEXT,
        step2 TEXT,
        step3 TEXT,
        path TEXT,
        archetype TEXT,
        analog TEXT
    )");
    
    // Create indexes
    $db->exec("CREATE INDEX IF NOT EXISTS idx_path ON quiz_results(path)");
    $db->exec("CREATE INDEX IF NOT EXISTS idx_archetype ON quiz_results(archetype)");
    
    // Create rate limiting table
    $db->exec("CREATE TABLE IF NOT EXISTS rate_limits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip_address TEXT NOT NULL,
        submission_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        path TEXT
    )");
    $db->exec("CREATE INDEX IF NOT EXISTS idx_ip_time ON rate_limits(ip_address, submission_time)");
    
    // Create recent submissions table for duplicate detection
    $db->exec("CREATE TABLE IF NOT EXISTS recent_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip_address TEXT NOT NULL,
        path TEXT NOT NULL,
        submission_time DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
    $db->exec("CREATE INDEX IF NOT EXISTS idx_recent_ip_path ON recent_submissions(ip_address, path, submission_time)");
    
    // Create CSRF tokens table
    $db->exec("CREATE TABLE IF NOT EXISTS csrf_tokens (
        ip_address TEXT NOT NULL,
        token TEXT NOT NULL,
        expiry DATETIME NOT NULL,
        PRIMARY KEY (ip_address, token)
    )");
    $db->exec("CREATE INDEX IF NOT EXISTS idx_csrf_expiry ON csrf_tokens(expiry)");
    
    $ip = getClientIp();
    
    // Handle GET request - return CSRF token or statistics
    if ($request_method === 'GET') {
        // Check if requesting CSRF token
        if (isset($_GET['csrf_token']) && $_GET['csrf_token'] === '1') {
            $token = generateCsrfToken($db, $ip);
            echo json_encode(['csrf_token' => $token]);
            exit;
        }
        
        // Otherwise return statistics
        $stats = [];
        
        $stmt = $db->query("SELECT COUNT(*) as total FROM quiz_results");
        $stats['total'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        $stmt = $db->query("SELECT archetype, COUNT(*) as count FROM quiz_results GROUP BY archetype ORDER BY count DESC");
        $stats['archetypes'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $stmt = $db->query("SELECT path, COUNT(*) as count FROM quiz_results GROUP BY path ORDER BY count DESC");
        $stats['paths'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $stmt = $db->query("SELECT step1, COUNT(*) as count FROM quiz_results GROUP BY step1 ORDER BY count DESC");
        $stats['step1'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $stmt = $db->query("SELECT step2, COUNT(*) as count FROM quiz_results GROUP BY step2 ORDER BY count DESC");
        $stats['step2'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $stmt = $db->query("SELECT step3, COUNT(*) as count FROM quiz_results GROUP BY step3 ORDER BY count DESC");
        $stats['step3'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($stats);
        exit;
    }
    
    // Handle POST request - submissions only
    if ($request_method === 'POST') {
        // Check Content-Length
        $content_length = $_SERVER['CONTENT_LENGTH'] ?? 0;
        if ($content_length > MAX_REQUEST_SIZE) {
            sendError(413, 'Request too large');
        }
        
        // Read input with size limit
        $input = file_get_contents('php://input', false, null, 0, MAX_REQUEST_SIZE + 1);
        if (strlen($input) > MAX_REQUEST_SIZE) {
            sendError(413, 'Request too large');
        }
        
        $content_type = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';
        
        // Parse input based on content type
        $data = [];
        if (stripos($content_type, 'application/json') !== false) {
            $data = json_decode($input, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                sendError(400, 'Invalid request format');
            }
        } elseif (stripos($content_type, 'application/x-www-form-urlencoded') !== false || !empty($_POST)) {
            // Use $_POST if available, otherwise parse input
            if (!empty($_POST)) {
                $data = $_POST;
            } else {
                parse_str($input, $data);
            }
        } else {
            sendError(400, 'Invalid content type');
        }
        
        // Check for save parameter
        if (!isset($data['save']) || $data['save'] !== '1') {
            sendError(400, 'Invalid request');
        }
        
        // Validate CSRF token
        $csrf_token = $data['csrf_token'] ?? '';
        if (!validateCsrfToken($db, $ip, $csrf_token)) {
            sendError(403, 'Invalid or missing security token');
        }
        
        // Validate and sanitize input
        $validation = validateAndSanitizeInput($data);
        if (!$validation['valid']) {
            sendError(400, 'Invalid input data');
        }
        
        $sanitized = $validation['data'];
        
        // Check rate limits
        $rate_check = checkRateLimit($db, $ip);
        if (!$rate_check['allowed']) {
            http_response_code(429);
            echo json_encode(['error' => 'Rate limit exceeded', 'retry_after' => MIN_SECONDS_BETWEEN_SUBMISSIONS]);
            exit;
        }
        
        // Check for duplicate submission
        $duplicate_check = checkDuplicateSubmission($db, $ip, $sanitized['path']);
        if (!$duplicate_check['allowed']) {
            sendError(409, 'Duplicate submission');
        }
        
        // All checks passed, insert into database
        $stmt = $db->prepare("INSERT INTO quiz_results (step1, step2, step3, path, archetype, analog) VALUES (:step1, :step2, :step3, :path, :archetype, :analog)");
        $result = $stmt->execute([
            ':step1' => $sanitized['step1'],
            ':step2' => $sanitized['step2'],
            ':step3' => $sanitized['step3'],
            ':path' => $sanitized['path'],
            ':archetype' => $sanitized['archetype'],
            ':analog' => $sanitized['analog'],
        ]);
        
        if (!$result) {
            sendError(500, 'Failed to save data');
        }
        
        // Record submission for rate limiting
        recordSubmission($db, $ip, $sanitized['path']);
        
        echo json_encode(['success' => true]);
        exit;
    }
    
    // Method not allowed
    sendError(405, 'Method not allowed');
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}
?>
