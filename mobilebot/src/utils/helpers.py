"""
Helper utilities for MobileBot IMEI Reader.

This module contains utility functions for IMEI validation,
formatting, and other common operations.
"""

import re
import platform
import subprocess
from datetime import datetime
from typing import Optional, List


def validate_imei(imei: str) -> bool:
    """
    Validate IMEI using Luhn algorithm.
    
    Args:
        imei: IMEI string to validate
        
    Returns:
        True if IMEI is valid, False otherwise
    """
    if not imei or not isinstance(imei, str):
        return False
    
    # Remove any non-digit characters
    clean_imei = re.sub(r'\D', '', imei)
    
    # IMEI should be exactly 15 digits
    if len(clean_imei) != 15:
        return False
    
    # Apply Luhn algorithm
    total = 0
    for i, digit in enumerate(reversed(clean_imei)):
        n = int(digit)
        if i % 2 == 1:  # Every second digit from right
            n *= 2
            if n > 9:
                n = n // 10 + n % 10
        total += n
    
    return total % 10 == 0


def format_imei(imei: str) -> Optional[str]:
    """
    Format IMEI string by removing non-digit characters.
    
    Args:
        imei: Raw IMEI string
        
    Returns:
        Formatted IMEI or None if invalid
    """
    if not imei:
        return None
    
    # Remove any non-digit characters
    clean_imei = re.sub(r'\D', '', str(imei))
    
    # Return only if it's 15 digits
    if len(clean_imei) == 15:
        return clean_imei
    
    return None


def extract_imei_from_hex(hex_output: str) -> Optional[str]:
    """
    Extract IMEI from hexadecimal ADB output.
    
    Args:
        hex_output: Raw hexadecimal output from ADB command
        
    Returns:
        Extracted IMEI or None if not found
    """
    if not hex_output:
        return None
    
    # Pattern to match IMEI in hex format
    patterns = [
        r"'(\d{15})'",  # Direct IMEI in quotes
        r'"(\d{15})"',  # IMEI in double quotes
        r'(\d{15})',    # Just 15 digits
    ]
    
    for pattern in patterns:
        match = re.search(pattern, hex_output)
        if match:
            imei = match.group(1)
            if validate_imei(imei):
                return imei
    
    # Try to decode hex values
    try:
        # Look for hex patterns that might contain IMEI
        hex_values = re.findall(r'0x([0-9a-fA-F]+)', hex_output)
        for hex_val in hex_values:
            try:
                # Convert hex to ASCII
                ascii_val = bytes.fromhex(hex_val).decode('ascii', errors='ignore')
                # Extract digits only
                digits = re.sub(r'\D', '', ascii_val)
                if len(digits) == 15 and validate_imei(digits):
                    return digits
            except (ValueError, UnicodeDecodeError):
                continue
    except Exception:
        pass
    
    return None


def get_timestamp() -> str:
    """
    Get current timestamp in ISO format.
    
    Returns:
        Current timestamp string
    """
    return datetime.now().isoformat()


def get_platform_info() -> dict:
    """
    Get platform information.
    
    Returns:
        Dictionary with platform details
    """
    return {
        "system": platform.system(),
        "release": platform.release(),
        "version": platform.version(),
        "machine": platform.machine(),
        "processor": platform.processor(),
        "python_version": platform.python_version(),
    }


def find_adb_executable() -> Optional[str]:
    """
    Find ADB executable in system PATH.
    
    Returns:
        Path to ADB executable or None if not found
    """
    try:
        # Try to run 'adb version' to check if ADB is available
        result = subprocess.run(
            ["adb", "version"],
            capture_output=True,
            text=True,
            timeout=5
        )
        if result.returncode == 0:
            return "adb"
    except (subprocess.SubprocessError, FileNotFoundError):
        pass
    
    # Try common installation paths
    common_paths = [
        "/usr/local/bin/adb",
        "/opt/android-sdk/platform-tools/adb",
        "C:\\Android\\platform-tools\\adb.exe",
        "C:\\Program Files\\Android\\platform-tools\\adb.exe",
    ]
    
    for path in common_paths:
        try:
            result = subprocess.run(
                [path, "version"],
                capture_output=True,
                text=True,
                timeout=5
            )
            if result.returncode == 0:
                return path
        except (subprocess.SubprocessError, FileNotFoundError):
            continue
    
    return None


def get_available_serial_ports() -> List[str]:
    """
    Get list of available serial ports.
    
    Returns:
        List of available serial port names
    """
    import serial.tools.list_ports
    
    ports = []
    for port in serial.tools.list_ports.comports():
        ports.append(port.device)
    
    return ports


def is_android_device_connected() -> bool:
    """
    Check if any Android device is connected via ADB.
    
    Returns:
        True if Android device is connected, False otherwise
    """
    adb_path = find_adb_executable()
    if not adb_path:
        return False
    
    try:
        result = subprocess.run(
            [adb_path, "devices"],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if result.returncode == 0:
            # Parse output to check for connected devices
            lines = result.stdout.strip().split('\n')
            for line in lines[1:]:  # Skip header line
                if line.strip() and 'device' in line:
                    return True
    except (subprocess.SubprocessError, FileNotFoundError):
        pass
    
    return False
