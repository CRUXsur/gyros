"""
MobileBot - IMEI Reader Automation
==================================

A Python automation tool for reading IMEI from mobile devices connected via USB.
Supports multiple connection methods including ADB and AT commands.

Author: MobileBot Development Team
Version: 1.0.0
"""

__version__ = "1.0.0"
__author__ = "MobileBot Development Team"
__email__ = "support@mobilebot.dev"

from .main import main

__all__ = ["main"]
