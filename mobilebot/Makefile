# Makefile for MobileBot IMEI Reader

# Variables
PYTHON := python3
PIP := pip3
VENV_DIR := venv
SRC_DIR := src
TEST_DIR := tests
DIST_DIR := dist

# Colors for output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[0;33m
BLUE := \033[0;34m
NC := \033[0m # No Color

.PHONY: help install install-dev test test-unit test-integration lint format clean build run setup venv

# Default target
help: ## Show this help message
	@echo "$(BLUE)MobileBot IMEI Reader - Makefile Commands$(NC)"
	@echo "============================================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

# Setup and Installation
setup: venv install ## Complete setup: create venv and install dependencies
	@echo "$(GREEN)✅ Setup completed!$(NC)"

venv: ## Create virtual environment
	@echo "$(BLUE)Creating virtual environment...$(NC)"
	$(PYTHON) -m venv $(VENV_DIR)
	@echo "$(GREEN)✅ Virtual environment created$(NC)"
	@echo "$(YELLOW)Activate with: source $(VENV_DIR)/bin/activate$(NC)"

install: ## Install production dependencies
	@echo "$(BLUE)Installing dependencies...$(NC)"
	$(PIP) install -r requirements.txt
	@echo "$(GREEN)✅ Dependencies installed$(NC)"

install-dev: install ## Install development dependencies
	@echo "$(BLUE)Installing development dependencies...$(NC)"
	$(PIP) install pytest pytest-cov black flake8 mypy
	@echo "$(GREEN)✅ Development dependencies installed$(NC)"

# Testing
test: test-unit test-integration ## Run all tests
	@echo "$(GREEN)✅ All tests completed$(NC)"

test-unit: ## Run unit tests
	@echo "$(BLUE)Running unit tests...$(NC)"
	$(PYTHON) -m pytest $(TEST_DIR) -v

test-integration: ## Run integration tests
	@echo "$(BLUE)Running integration tests...$(NC)"
	$(PYTHON) run_tests.py

test-coverage: ## Run tests with coverage report
	@echo "$(BLUE)Running tests with coverage...$(NC)"
	$(PYTHON) -m pytest $(TEST_DIR) --cov=$(SRC_DIR) --cov-report=html --cov-report=term

# Code Quality
lint: ## Run linting (flake8)
	@echo "$(BLUE)Running linter...$(NC)"
	flake8 $(SRC_DIR) $(TEST_DIR) --max-line-length=120 --ignore=E203,W503

format: ## Format code with black
	@echo "$(BLUE)Formatting code...$(NC)"
	black $(SRC_DIR) $(TEST_DIR) --line-length=120

type-check: ## Run type checking with mypy
	@echo "$(BLUE)Running type checker...$(NC)"
	mypy $(SRC_DIR) --ignore-missing-imports

check: lint type-check ## Run all code quality checks
	@echo "$(GREEN)✅ Code quality checks completed$(NC)"

# Application
run: ## Run the application
	@echo "$(BLUE)Starting MobileBot IMEI Reader...$(NC)"
	$(PYTHON) $(SRC_DIR)/main.py

run-help: ## Show application help
	$(PYTHON) $(SRC_DIR)/main.py --help

run-list-devices: ## List connected devices
	$(PYTHON) $(SRC_DIR)/main.py --list-devices

run-list-methods: ## List available methods
	$(PYTHON) $(SRC_DIR)/main.py --list-methods

run-verbose: ## Run with verbose output
	$(PYTHON) $(SRC_DIR)/main.py --verbose

run-wait: ## Wait for device and read IMEI
	$(PYTHON) $(SRC_DIR)/main.py --wait

# Building and Distribution
build: ## Build executable with PyInstaller
	@echo "$(BLUE)Building executable...$(NC)"
	$(PYTHON) build_executable.py

build-dev: ## Build executable in development mode
	@echo "$(BLUE)Building development executable...$(NC)"
	pyinstaller --onefile --name mobilebot-dev $(SRC_DIR)/main.py

# Documentation
docs: ## Generate documentation
	@echo "$(BLUE)Documentation is already written in markdown files$(NC)"
	@echo "Available docs:"
	@echo "  - README.md"
	@echo "  - INSTALLATION_GUIDE.md"
	@echo "  - USAGE_EXAMPLES.md"
	@echo "  - DEVELOPMENT_PLAN.md"

# Cleaning
clean: ## Clean build artifacts
	@echo "$(BLUE)Cleaning build artifacts...$(NC)"
	rm -rf build/
	rm -rf $(DIST_DIR)/
	rm -rf *.spec
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	@echo "$(GREEN)✅ Cleanup completed$(NC)"

clean-logs: ## Clean log files
	@echo "$(BLUE)Cleaning log files...$(NC)"
	rm -rf logs/*.log 2>/dev/null || true
	@echo "$(GREEN)✅ Log files cleaned$(NC)"

clean-all: clean clean-logs ## Clean everything including logs
	@echo "$(GREEN)✅ Complete cleanup done$(NC)"

# Development helpers
dev-setup: setup install-dev ## Complete development setup
	@echo "$(GREEN)✅ Development environment ready!$(NC)"

dev-test: format lint test ## Run development test cycle
	@echo "$(GREEN)✅ Development test cycle completed$(NC)"

# Docker (future use)
docker-build: ## Build Docker image
	@echo "$(YELLOW)Docker support not implemented yet$(NC)"

docker-run: ## Run in Docker container
	@echo "$(YELLOW)Docker support not implemented yet$(NC)"

# Package management
freeze: ## Generate requirements.txt from current environment
	$(PIP) freeze > requirements-freeze.txt
	@echo "$(GREEN)✅ Requirements frozen to requirements-freeze.txt$(NC)"

upgrade: ## Upgrade all packages
	$(PIP) list --outdated --format=freeze | grep -v '^\-e' | cut -d = -f 1 | xargs -n1 $(PIP) install -U
	@echo "$(GREEN)✅ Packages upgraded$(NC)"

# Git helpers
git-status: ## Show git status with colors
	@echo "$(BLUE)Git Status:$(NC)"
	git status --short

git-log: ## Show recent git log
	@echo "$(BLUE)Recent commits:$(NC)"
	git log --oneline -10

# Project info
info: ## Show project information
	@echo "$(BLUE)MobileBot IMEI Reader - Project Information$(NC)"
	@echo "=============================================="
	@echo "Python version: $(shell $(PYTHON) --version)"
	@echo "Pip version: $(shell $(PIP) --version)"
	@echo "Project directory: $(shell pwd)"
	@echo "Source directory: $(SRC_DIR)"
	@echo "Test directory: $(TEST_DIR)"
	@echo ""
	@echo "$(BLUE)Dependencies:$(NC)"
	@$(PIP) list | head -20

version: ## Show application version
	$(PYTHON) $(SRC_DIR)/main.py --version

# Quick commands for common tasks
quick-test: ## Quick test (unit tests only)
	$(PYTHON) -m pytest $(TEST_DIR) -x -v

quick-run: ## Quick run with auto-detection
	$(PYTHON) $(SRC_DIR)/main.py --timeout 10

# Install system dependencies (platform specific)
install-system-deps: ## Install system dependencies
	@echo "$(BLUE)Installing system dependencies...$(NC)"
	@case "$(shell uname -s)" in \
		Darwin) echo "macOS detected"; brew install android-platform-tools || echo "Install Homebrew first" ;; \
		Linux) echo "Linux detected"; sudo apt-get update && sudo apt-get install -y android-tools-adb || echo "Use your package manager" ;; \
		*) echo "$(YELLOW)Unknown system. Please install ADB manually$(NC)" ;; \
	esac
