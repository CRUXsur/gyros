"""
Main entry point for MobileBot IMEI Reader.

This module provides the command-line interface and main application logic
for reading IMEI from mobile devices connected via USB.
"""

import sys
import argparse
import signal
import os
from typing import Optional
from pathlib import Path

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from core.imei_reader import IMEIReader
from utils.logger import console, setup_logger
from utils.helpers import get_platform_info


def signal_handler(signum, frame):
    """Handle interrupt signals gracefully."""
    console.log("\n🛑 Operation interrupted by user")
    sys.exit(0)


def setup_signal_handlers():
    """Setup signal handlers for graceful shutdown."""
    signal.signal(signal.SIGINT, signal_handler)
    if hasattr(signal, 'SIGTERM'):
        signal.signal(signal.SIGTERM, signal_handler)


def print_banner():
    """Print application banner."""
    banner = """
╔══════════════════════════════════════════════════════════════╗
║                    MobileBot IMEI Reader                     ║
║                  Python Automation Tool v1.0                ║
╠══════════════════════════════════════════════════════════════╣
║  Automatically reads IMEI from mobile devices via USB       ║
║  Supports Android (ADB) and Serial (AT Commands) devices    ║
╚══════════════════════════════════════════════════════════════╝
"""
    console.log(banner)


def create_argument_parser() -> argparse.ArgumentParser:
    """
    Create command line argument parser.
    
    Returns:
        Configured argument parser
    """
    parser = argparse.ArgumentParser(
        description="MobileBot IMEI Reader - Read IMEI from USB-connected mobile devices",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s                          # Auto-detect device and read IMEI
  %(prog)s --wait                   # Wait for device connection
  %(prog)s --device-type android    # Wait for specific device type
  %(prog)s --list-devices           # List detected devices
  %(prog)s --list-methods           # List available reading methods
  %(prog)s --config config.json     # Use custom configuration file
  %(prog)s --timeout 60             # Set custom timeout
  %(prog)s --verbose                # Enable verbose logging
        """
    )
    
    parser.add_argument(
        "--config",
        type=str,
        help="Path to configuration file (default: config.json)"
    )
    
    parser.add_argument(
        "--wait",
        action="store_true",
        help="Wait for device to be connected"
    )
    
    parser.add_argument(
        "--device-type",
        choices=["android", "serial"],
        help="Wait for specific device type"
    )
    
    parser.add_argument(
        "--timeout",
        type=int,
        default=30,
        help="Timeout in seconds for device detection (default: 30)"
    )
    
    parser.add_argument(
        "--method",
        type=str,
        help="Force use of specific method (e.g., ADBMethod, ATCommandsMethod)"
    )
    
    parser.add_argument(
        "--list-devices",
        action="store_true",
        help="List detected devices and exit"
    )
    
    parser.add_argument(
        "--list-methods",
        action="store_true",
        help="List available reading methods and exit"
    )
    
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Enable verbose logging"
    )
    
    parser.add_argument(
        "--quiet", "-q",
        action="store_true",
        help="Suppress non-essential output"
    )
    
    parser.add_argument(
        "--version",
        action="version",
        version="MobileBot IMEI Reader v1.0.0"
    )
    
    return parser


def list_devices(reader: IMEIReader) -> None:
    """
    List detected devices.
    
    Args:
        reader: IMEIReader instance
    """
    console.log("🔍 Scanning for devices...")
    devices = reader.get_device_list()
    
    if not devices:
        console.log("❌ No devices detected")
        return
    
    console.log(f"📱 Found {len(devices)} device(s):")
    console.log("=" * 60)
    
    for i, device in enumerate(devices, 1):
        console.log(f"Device {i}:")
        console.log(f"  Type: {device.device_type}")
        console.log(f"  Connection Info:")
        
        for key, value in device.connection_info.items():
            console.log(f"    {key}: {value}")
        
        console.log("-" * 40)


def list_methods(reader: IMEIReader) -> None:
    """
    List available reading methods.
    
    Args:
        reader: IMEIReader instance
    """
    methods = reader.list_available_methods()
    
    console.log(f"🛠️  Available reading methods ({len(methods)}):")
    console.log("=" * 50)
    
    for method in methods:
        console.log(f"Name: {method['name']}")
        console.log(f"Priority: {method['priority']}")
        console.log(f"Description: {method['description']}")
        console.log("-" * 40)


def main() -> int:
    """
    Main application entry point.
    
    Returns:
        Exit code (0 for success, non-zero for error)
    """
    # Setup signal handlers
    setup_signal_handlers()
    
    # Parse command line arguments
    parser = create_argument_parser()
    args = parser.parse_args()
    
    # Show banner unless quiet mode
    if not args.quiet:
        print_banner()
    
    try:
        # Initialize IMEI reader
        console.log("🚀 Initializing MobileBot IMEI Reader...")
        reader = IMEIReader(args.config)
        
        # Set up verbose logging if requested
        if args.verbose:
            logger = setup_logger("Main", {"level": "DEBUG", "console_enabled": True, "file_enabled": False})
            logger.info("Verbose mode enabled")
            
            # Show platform info
            platform_info = get_platform_info()
            console.log("💻 Platform Information:")
            for key, value in platform_info.items():
                console.log(f"   {key}: {value}")
        
        # Handle list commands
        if args.list_devices:
            list_devices(reader)
            return 0
        
        if args.list_methods:
            list_methods(reader)
            return 0
        
        # Read IMEI based on arguments
        result = None
        
        if args.wait or args.device_type:
            # Wait for device
            result = reader.wait_for_device_and_read(args.device_type, args.timeout)
        else:
            # Auto-detect and read
            result = reader.read_imei_auto(args.timeout)
        
        # Handle result
        if result.success:
            if not args.quiet:
                console.log("🎉 IMEI reading completed successfully!")
            return 0
        else:
            console.error(f"❌ Failed to read IMEI: {result.error}")
            return 1
    
    except KeyboardInterrupt:
        console.log("\n🛑 Operation interrupted by user")
        return 130
    
    except Exception as e:
        console.error(f"💥 Unexpected error: {str(e)}")
        if args.verbose:
            import traceback
            console.error(traceback.format_exc())
        return 1
    
    finally:
        # Cleanup
        try:
            if 'reader' in locals():
                reader.cleanup()
        except Exception as e:
            if args.verbose:
                console.error(f"Cleanup error: {e}")


def run_gui() -> None:
    """
    Run GUI version of the application.
    Note: GUI implementation would go here in future versions.
    """
    console.error("GUI mode not implemented yet. Use command line interface.")
    sys.exit(1)


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
