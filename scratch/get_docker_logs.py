import subprocess

try:
    print("Fetching docker logs for pmposhan-api...")
    result = subprocess.run(
        ["docker", "logs", "--tail", "50", "pmposhan-api"], 
        capture_output=True, 
        text=True,
        check=False
    )
    
    with open("scratch/docker_logs_crash.txt", "w", encoding="utf-8") as f:
        f.write("=== STDOUT ===\n")
        f.write(result.stdout)
        f.write("\n=== STDERR ===\n")
        f.write(result.stderr)
        
    print("Successfully wrote logs to scratch/docker_logs_crash.txt")
except Exception as e:
    print(f"Failed to fetch logs: {e}")
