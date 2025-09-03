#!/usr/bin/env python3
"""
Build script for creating MobileBot IMEI Reader executable.

This script uses PyInstaller to create a standalone executable.
"""

import os
import sys
import shutil
import subprocess
from pathlib import Path


def check_pyinstaller():
    """Check if PyInstaller is installed."""
    try:
        import PyInstaller
        print(f"✅ PyInstaller {PyInstaller.__version__} is installed")
        return True
    except ImportError:
        print("❌ PyInstaller is not installed")
        print("Install with: pip install pyinstaller")
        return False


def create_spec_file():
    """Create PyInstaller spec file with custom configuration."""
    spec_content = '''# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

a = Analysis(
    ['src/main.py'],
    pathex=[],
    binaries=[],
    datas=[
        ('config.json', '.'),
        ('README.md', '.'),
        ('INSTALLATION_GUIDE.md', '.'),
    ],
    hiddenimports=[
        'serial',
        'serial.tools',
        'serial.tools.list_ports',
        'psutil',
        'colorlog',
        'yaml',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='mobilebot-imei-reader',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=None
)
'''

    with open('mobilebot.spec', 'w') as f:
        f.write(spec_content)
    
    print("✅ Created mobilebot.spec file")


def build_executable():
    """Build the executable using PyInstaller."""
    print("🔨 Building executable...")
    
    # Create spec file
    create_spec_file()
    
    # Run PyInstaller
    cmd = [
        sys.executable, '-m', 'PyInstaller',
        '--clean',
        '--noconfirm',
        'mobilebot.spec'
    ]
    
    try:
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        print("✅ Build completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Build failed with error code {e.returncode}")
        print(f"Error output: {e.stderr}")
        return False


def create_distribution():
    """Create distribution package."""
    print("📦 Creating distribution package...")
    
    # Create dist directory structure
    dist_dir = Path("dist/mobilebot-package")
    dist_dir.mkdir(parents=True, exist_ok=True)
    
    # Copy executable
    executable_name = "mobilebot-imei-reader"
    if sys.platform == "win32":
        executable_name += ".exe"
    
    executable_path = Path("dist") / executable_name
    if executable_path.exists():
        shutil.copy2(executable_path, dist_dir / executable_name)
        print(f"✅ Copied executable: {executable_name}")
    else:
        print(f"❌ Executable not found: {executable_path}")
        return False
    
    # Copy documentation
    docs_to_copy = [
        "README.md",
        "INSTALLATION_GUIDE.md", 
        "USAGE_EXAMPLES.md",
        "config.json"
    ]
    
    for doc in docs_to_copy:
        if Path(doc).exists():
            shutil.copy2(doc, dist_dir / doc)
            print(f"✅ Copied: {doc}")
    
    # Create startup scripts
    create_startup_scripts(dist_dir, executable_name)
    
    print(f"✅ Distribution package created in: {dist_dir}")
    return True


def create_startup_scripts(dist_dir, executable_name):
    """Create platform-specific startup scripts."""
    
    # Windows batch file
    if sys.platform == "win32":
        batch_content = f'''@echo off
echo Starting MobileBot IMEI Reader...
"{executable_name}" %*
pause
'''
        with open(dist_dir / "run_mobilebot.bat", "w") as f:
            f.write(batch_content)
        print("✅ Created Windows batch file")
    
    # Unix shell script
    else:
        shell_content = f'''#!/bin/bash
echo "Starting MobileBot IMEI Reader..."
./{executable_name} "$@"
'''
        script_path = dist_dir / "run_mobilebot.sh"
        with open(script_path, "w") as f:
            f.write(shell_content)
        script_path.chmod(0o755)  # Make executable
        print("✅ Created Unix shell script")


def test_executable():
    """Test the built executable."""
    print("🧪 Testing executable...")
    
    executable_name = "mobilebot-imei-reader"
    if sys.platform == "win32":
        executable_name += ".exe"
    
    executable_path = Path("dist") / executable_name
    
    if not executable_path.exists():
        print(f"❌ Executable not found: {executable_path}")
        return False
    
    # Test version command
    try:
        result = subprocess.run(
            [str(executable_path), "--version"],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if result.returncode == 0:
            print("✅ Executable test passed")
            print(f"Version output: {result.stdout.strip()}")
            return True
        else:
            print(f"❌ Executable test failed with code {result.returncode}")
            return False
    
    except subprocess.TimeoutExpired:
        print("❌ Executable test timed out")
        return False
    except Exception as e:
        print(f"❌ Executable test failed: {e}")
        return False


def cleanup():
    """Clean up build artifacts."""
    print("🧹 Cleaning up build artifacts...")
    
    # Remove build directory
    if Path("build").exists():
        shutil.rmtree("build")
        print("✅ Removed build directory")
    
    # Remove spec file
    if Path("mobilebot.spec").exists():
        os.remove("mobilebot.spec")
        print("✅ Removed spec file")
    
    # Remove __pycache__ directories
    for pycache in Path(".").rglob("__pycache__"):
        shutil.rmtree(pycache)
        print(f"✅ Removed {pycache}")


def main():
    """Main build function."""
    print("🚀 MobileBot IMEI Reader - Build Script")
    print("=" * 50)
    
    # Check PyInstaller
    if not check_pyinstaller():
        return 1
    
    # Build executable
    if not build_executable():
        return 1
    
    # Test executable
    if not test_executable():
        print("⚠️  Warning: Executable test failed, but build completed")
    
    # Create distribution
    if not create_distribution():
        return 1
    
    # Ask about cleanup
    cleanup_choice = input("\n🧹 Clean up build artifacts? (y/N): ").strip().lower()
    if cleanup_choice in ['y', 'yes']:
        cleanup()
    
    print("\n🎉 Build process completed!")
    print("\nNext steps:")
    print("1. Test the executable in dist/mobilebot-package/")
    print("2. Distribute the entire mobilebot-package folder")
    print("3. Users can run the executable directly or use the startup scripts")
    
    return 0


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
