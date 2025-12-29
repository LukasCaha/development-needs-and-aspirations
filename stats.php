<?php
// Only set headers if not running from CLI
if (php_sapi_name() !== 'cli') {
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

// Detect request method - some servers don't set REQUEST_METHOD correctly
$request_method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Check Content-Type header (try both variations)
$content_type = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';

// Detect POST
$is_post = ($request_method === 'POST');

// Don't read php://input yet - let PHP populate $_POST first for form-encoded data
// We'll read it later if needed for JSON
$input = '';

if ($request_method === 'OPTIONS') {
    exit(0);
}

$db_file = __DIR__ . '/quiz_stats.db';

try {
    // Use PDO instead of SQLite3 (more commonly available)
    $db = new PDO("sqlite:$db_file");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Initialize database if it doesn't exist
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
    
    // Create indexes if they don't exist
    $db->exec("CREATE INDEX IF NOT EXISTS idx_path ON quiz_results(path)");
    $db->exec("CREATE INDEX IF NOT EXISTS idx_archetype ON quiz_results(archetype)");
    
    // Check if this is a save request (POST with data, or GET with save=1)
    // Check GET first since some servers don't handle POST correctly
    $request_uri = $_SERVER['REQUEST_URI'] ?? $_SERVER['SCRIPT_NAME'] ?? '';
    $query_string = $_SERVER['QUERY_STRING'] ?? '';
    
    // Parse query string manually to be sure we get all params
    parse_str($query_string, $get_params);
    
    // Check if save parameter exists in either $_GET, $_POST, or parsed params
    $has_save_param = isset($_GET['save']) || isset($_POST['save']) || isset($get_params['save']) || strpos($query_string, 'save=1') !== false || strpos($query_string, 'save=') !== false;
    
    // Debug: log what we're receiving
    $debug_info = [
        'request_method' => $request_method,
        'is_post' => $is_post,
        'post_empty' => empty($_POST),
        'post_keys' => array_keys($_POST),
        'content_type' => $content_type,
        'has_input' => !empty($input),
    ];
    
    // Check POST first - $_POST should be auto-populated for form-encoded data
    if ($is_post && !empty($_POST) && isset($_POST['save'])) {
        // Form-encoded POST data (PHP auto-populates $_POST)
        $data = [
            'step1' => $_POST['step1'] ?? null,
            'step2' => $_POST['step2'] ?? null,
            'step3' => $_POST['step3'] ?? null,
            'path' => $_POST['path'] ?? null,
            'archetype' => $_POST['archetype'] ?? null,
            'analog' => $_POST['analog'] ?? null,
        ];
        
        if (!isset($data['archetype'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required data in POST', 'received' => array_keys($_POST)]);
            exit;
        }
        
        $stmt = $db->prepare("INSERT INTO quiz_results (step1, step2, step3, path, archetype, analog) VALUES (:step1, :step2, :step3, :path, :archetype, :analog)");
        $result = $stmt->execute([
            ':step1' => $data['step1'] ?? null,
            ':step2' => $data['step2'] ?? null,
            ':step3' => $data['step3'] ?? null,
            ':path' => $data['path'] ?? null,
            ':archetype' => $data['archetype'] ?? null,
            ':analog' => $data['analog'] ?? null,
        ]);
        
        if (!$result) {
            http_response_code(500);
            $errorInfo = $stmt->errorInfo();
            echo json_encode(['error' => 'Failed to insert', 'db_error' => $errorInfo]);
            exit;
        }
        
        echo json_encode(['success' => true, 'inserted' => true, 'method' => 'POST_FORM', 'debug' => $debug_info]);
    } elseif ($has_save_param) {
        // Use parsed params or $_GET, whichever has data
        $source = !empty($get_params) ? $get_params : $_GET;
        
        $data = [
            'step1' => $source['step1'] ?? null,
            'step2' => $source['step2'] ?? null,
            'step3' => $source['step3'] ?? null,
            'path' => $source['path'] ?? null,
            'archetype' => $source['archetype'] ?? null,
            'analog' => $source['analog'] ?? null,
        ];
        
        if (!$data || !isset($data['archetype'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required data in GET']);
            exit;
        }
        
        $stmt = $db->prepare("INSERT INTO quiz_results (step1, step2, step3, path, archetype, analog) VALUES (:step1, :step2, :step3, :path, :archetype, :analog)");
        $result = $stmt->execute([
            ':step1' => $data['step1'] ?? null,
            ':step2' => $data['step2'] ?? null,
            ':step3' => $data['step3'] ?? null,
            ':path' => $data['path'] ?? null,
            ':archetype' => $data['archetype'] ?? null,
            ':analog' => $data['analog'] ?? null,
        ]);
        
        if (!$result) {
            http_response_code(500);
            $errorInfo = $stmt->errorInfo();
            echo json_encode(['error' => 'Failed to insert', 'db_error' => $errorInfo]);
            exit;
        }
        
        echo json_encode(['success' => true, 'inserted' => true, 'method' => 'GET']);
    } elseif ($is_post) {
        // POST but no save parameter in $_POST - try reading raw input (might be JSON or form-encoded)
        if (empty($input)) {
            $input = file_get_contents('php://input');
        }
        
        if (stripos($content_type, 'application/json') !== false && !empty($input)) {
            // Try JSON body
            $data = json_decode($input, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid JSON', 'json_error' => json_last_error_msg()]);
                exit;
            }
        } elseif (!empty($input) && stripos($content_type, 'application/x-www-form-urlencoded') !== false) {
            // Parse form-encoded from raw input
            parse_str($input, $data);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'No POST data received', 'content_type' => $content_type, 'has_input' => !empty($input)]);
            exit;
        }
        
        if (!$data || !isset($data['archetype'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required data']);
            exit;
        }
        
        $stmt = $db->prepare("INSERT INTO quiz_results (step1, step2, step3, path, archetype, analog) VALUES (:step1, :step2, :step3, :path, :archetype, :analog)");
        $result = $stmt->execute([
            ':step1' => $data['step1'] ?? null,
            ':step2' => $data['step2'] ?? null,
            ':step3' => $data['step3'] ?? null,
            ':path' => $data['path'] ?? null,
            ':archetype' => $data['archetype'] ?? null,
            ':analog' => $data['analog'] ?? null,
        ]);
        
        if (!$result) {
            http_response_code(500);
            $errorInfo = $stmt->errorInfo();
            echo json_encode(['error' => 'Failed to insert', 'db_error' => $errorInfo]);
            exit;
        }
        
        echo json_encode(['success' => true, 'inserted' => true, 'method' => 'POST']);
    } else {
        // Not a save request, return statistics
        // But if it was POST, log debug info
        if ($is_post) {
            error_log("POST received but not saved. Debug: " . json_encode($debug_info));
        }
        $stats = [];
        
        // Total submissions
        $stmt = $db->query("SELECT COUNT(*) as total FROM quiz_results");
        $stats['total'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Archetype distribution
        $stmt = $db->query("SELECT archetype, COUNT(*) as count FROM quiz_results GROUP BY archetype ORDER BY count DESC");
        $stats['archetypes'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Path distribution
        $stmt = $db->query("SELECT path, COUNT(*) as count FROM quiz_results GROUP BY path ORDER BY count DESC");
        $stats['paths'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Step 1 distribution
        $stmt = $db->query("SELECT step1, COUNT(*) as count FROM quiz_results GROUP BY step1 ORDER BY count DESC");
        $stats['step1'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Step 2 distribution
        $stmt = $db->query("SELECT step2, COUNT(*) as count FROM quiz_results GROUP BY step2 ORDER BY count DESC");
        $stats['step2'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Step 3 distribution
        $stmt = $db->query("SELECT step3, COUNT(*) as count FROM quiz_results GROUP BY step3 ORDER BY count DESC");
        $stats['step3'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($stats);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>

