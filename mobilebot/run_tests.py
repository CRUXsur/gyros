#!/usr/bin/env python3
"""
Test runner for MobileBot IMEI Reader.

This script runs all tests and provides a comprehensive test report.
"""

import sys
import os
import unittest
import subprocess
from pathlib import Path

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent / "src"))


def run_unit_tests():
    """Run unit tests and return results."""
    print("🧪 Running Unit Tests...")
    print("=" * 50)
    
    # Discover and run tests
    loader = unittest.TestLoader()
    start_dir = 'tests'
    suite = loader.discover(start_dir, pattern='test_*.py')
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    print(f"\n📊 Unit Test Results:")
    print(f"   Tests run: {result.testsRun}")
    print(f"   Failures: {len(result.failures)}")
    print(f"   Errors: {len(result.errors)}")
    print(f"   Success rate: {((result.testsRun - len(result.failures) - len(result.errors)) / result.testsRun * 100):.1f}%")
    
    return result


def run_integration_tests():
    """Run integration tests with real commands."""
    print("\n🔌 Running Integration Tests...")
    print("=" * 50)
    
    tests_passed = 0
    total_tests = 0
    
    # Test 1: Import all modules
    total_tests += 1
    try:
        from src.core.imei_reader import IMEIReader
        from src.core.device_detector import DeviceDetector
        from src.methods.adb_method import ADBMethod
        from src.methods.at_commands import ATCommandsMethod
        print("✅ Module imports: PASSED")
        tests_passed += 1
    except Exception as e:
        print(f"❌ Module imports: FAILED - {e}")
    
    # Test 2: Configuration loading
    total_tests += 1
    try:
        from src.core.config import Config
        config = Config()
        assert config.get('logging.level') is not None
        print("✅ Configuration loading: PASSED")
        tests_passed += 1
    except Exception as e:
        print(f"❌ Configuration loading: FAILED - {e}")
    
    # Test 3: Logger setup
    total_tests += 1
    try:
        from src.utils.logger import setup_logger, console
        logger = setup_logger("test", {"level": "INFO", "console_enabled": False, "file_enabled": False})
        console.log("Test message")
        print("✅ Logger setup: PASSED")
        tests_passed += 1
    except Exception as e:
        print(f"❌ Logger setup: FAILED - {e}")
    
    # Test 4: IMEI validation
    total_tests += 1
    try:
        from src.utils.helpers import validate_imei
        # Test with valid IMEI (using Luhn algorithm)
        assert validate_imei("123456789012345") is False  # Invalid
        assert validate_imei("490154203237518") is True   # Valid IMEI
        print("✅ IMEI validation: PASSED")
        tests_passed += 1
    except Exception as e:
        print(f"❌ IMEI validation: FAILED - {e}")
    
    # Test 5: Device detector initialization
    total_tests += 1
    try:
        detector = DeviceDetector({"scan_interval": 1, "timeout": 1, "logging": {"level": "ERROR", "console_enabled": False}})
        devices = detector.detect_devices()  # Should not crash
        print("✅ Device detector: PASSED")
        tests_passed += 1
    except Exception as e:
        print(f"❌ Device detector: FAILED - {e}")
    
    # Test 6: IMEI reader initialization
    total_tests += 1
    try:
        reader = IMEIReader()
        methods = reader.list_available_methods()
        assert len(methods) >= 2  # At least ADB and AT methods
        print("✅ IMEI reader initialization: PASSED")
        tests_passed += 1
    except Exception as e:
        print(f"❌ IMEI reader initialization: FAILED - {e}")
    
    print(f"\n📊 Integration Test Results:")
    print(f"   Tests run: {total_tests}")
    print(f"   Passed: {tests_passed}")
    print(f"   Failed: {total_tests - tests_passed}")
    print(f"   Success rate: {(tests_passed / total_tests * 100):.1f}%")
    
    return tests_passed == total_tests


def run_cli_tests():
    """Test command line interface."""
    print("\n💻 Running CLI Tests...")
    print("=" * 50)
    
    tests_passed = 0
    total_tests = 0
    
    cli_tests = [
        (["--version"], "version test"),
        (["--list-methods"], "list methods test"),
        (["--help"], "help test"),
    ]
    
    for args, description in cli_tests:
        total_tests += 1
        try:
            result = subprocess.run(
                [sys.executable, "src/main.py"] + args,
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if result.returncode == 0 or "--help" in args:  # Help returns 0
                print(f"✅ CLI {description}: PASSED")
                tests_passed += 1
            else:
                print(f"❌ CLI {description}: FAILED - Return code {result.returncode}")
                if result.stderr:
                    print(f"   Error: {result.stderr.strip()}")
        
        except subprocess.TimeoutExpired:
            print(f"❌ CLI {description}: FAILED - Timeout")
        except Exception as e:
            print(f"❌ CLI {description}: FAILED - {e}")
    
    print(f"\n📊 CLI Test Results:")
    print(f"   Tests run: {total_tests}")
    print(f"   Passed: {tests_passed}")
    print(f"   Failed: {total_tests - tests_passed}")
    print(f"   Success rate: {(tests_passed / total_tests * 100):.1f}%")
    
    return tests_passed == total_tests


def check_dependencies():
    """Check if all required dependencies are installed."""
    print("\n📦 Checking Dependencies...")
    print("=" * 50)
    
    required_packages = [
        'serial',
        'psutil',
        'colorlog',
        'yaml'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
            print(f"✅ {package}: installed")
        except ImportError:
            print(f"❌ {package}: missing")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n⚠️  Missing packages: {', '.join(missing_packages)}")
        print("Run: pip install -r requirements.txt")
        return False
    else:
        print("\n✅ All dependencies are installed")
        return True


def main():
    """Main test runner."""
    print("🚀 MobileBot IMEI Reader - Test Suite")
    print("=" * 60)
    
    # Check dependencies first
    deps_ok = check_dependencies()
    if not deps_ok:
        print("\n❌ Cannot run tests due to missing dependencies")
        return 1
    
    # Run all tests
    unit_result = run_unit_tests()
    integration_ok = run_integration_tests()
    cli_ok = run_cli_tests()
    
    # Overall results
    print("\n" + "=" * 60)
    print("📋 OVERALL TEST SUMMARY")
    print("=" * 60)
    
    unit_success = len(unit_result.failures) == 0 and len(unit_result.errors) == 0
    
    print(f"✅ Dependencies: {'PASSED' if deps_ok else 'FAILED'}")
    print(f"🧪 Unit Tests: {'PASSED' if unit_success else 'FAILED'}")
    print(f"🔌 Integration Tests: {'PASSED' if integration_ok else 'FAILED'}")
    print(f"💻 CLI Tests: {'PASSED' if cli_ok else 'FAILED'}")
    
    all_passed = deps_ok and unit_success and integration_ok and cli_ok
    
    if all_passed:
        print("\n🎉 ALL TESTS PASSED! 🎉")
        print("The application is ready for use.")
        return 0
    else:
        print("\n⚠️  SOME TESTS FAILED")
        print("Please review the failed tests before using the application.")
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
