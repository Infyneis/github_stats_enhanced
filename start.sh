#!/bin/bash

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║                                                                           ║
# ║   📊 GITHUB STATS ENHANCED - START SCRIPT                                 ║
# ║                                                                           ║
# ║   This script sets up and launches the GitHub Stats Enhanced app.         ║
# ║   It automatically installs all dependencies and starts the server.       ║
# ║                                                                           ║
# ║   Features:                                                               ║
# ║   • 🍺 Installs Homebrew if missing (macOS)                               ║
# ║   • 📦 Installs pnpm package manager                                      ║
# ║   • 🟢 Verifies Node.js installation                                      ║
# ║   • 🚀 Launches the Next.js development server                            ║
# ║                                                                           ║
# ║   Usage: ./start.sh [option]                                              ║
# ║                                                                           ║
# ║   Options:                                                                ║
# ║     (none)     Start development server (default)                         ║
# ║     --prod     Build and start production server                          ║
# ║     --build    Build for production only                                  ║
# ║     -h,--help  Show help message                                          ║
# ║                                                                           ║
# ║   Author: Samy DJEMILI                                                    ║
# ║   Project: #10/365 - Year Coding Challenge                                ║
# ║                                                                           ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

set -e # 🛑 Exit immediately if any command fails

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🎨 COLORS & FORMATTING                                                    │
# │ Define ANSI escape codes for colorful terminal output                     │
# └───────────────────────────────────────────────────────────────────────────┘
RED='\033[0;31m'    # ❌ Errors
GREEN='\033[0;32m'  # ✅ Success messages
YELLOW='\033[1;33m' # ⚠️  Warnings & installations
BLUE='\033[0;34m'   # 📘 Info messages
PURPLE='\033[0;35m' # 💜 Accent color
CYAN='\033[0;36m'   # 🔵 Highlights
WHITE='\033[1;37m'  # ⚪ Bold white
BOLD='\033[1m'      # 💪 Bold text
NC='\033[0m'        # 🔄 Reset (No Color)

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 📂 DIRECTORY SETUP                                                        │
# │ Navigate to the script's directory for consistent execution               │
# └───────────────────────────────────────────────────────────────────────────┘
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🔧 UTILITY FUNCTIONS                                                      │
# │ Helper functions for common operations                                    │
# └───────────────────────────────────────────────────────────────────────────┘

# 🔍 Check if a command exists in PATH
command_exists() {
    command -v "$1" &>/dev/null
}

# ✅ Print a success message with checkmark
print_success() {
    echo -e "${GREEN}   ✅ $1${NC}"
}

# ⚠️  Print a warning/info message
print_warning() {
    echo -e "${YELLOW}   ⚠️  $1${NC}"
}

# ❌ Print an error message
print_error() {
    echo -e "${RED}   ❌ $1${NC}"
}

# 📘 Print an info message
print_info() {
    echo -e "${BLUE}   📘 $1${NC}"
}

# 🔄 Print a step header
print_step() {
    echo ""
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}   $1${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🎬 WELCOME BANNER                                                         │
# │ Display a beautiful ASCII art header                                      │
# └───────────────────────────────────────────────────────────────────────────┘
print_header() {
    echo ""
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}                                                           ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}   📊  ${BOLD}${WHITE}GITHUB STATS ENHANCED${NC}                             ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}                                                           ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}   ${BOLD}Beautiful analytics with gamification & predictions${NC}   ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}                                                           ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}   🏆 Badges  ⚡ XP & Levels  🔮 Predictions  ⚔️  Battle   ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}                                                           ${CYAN}║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo -e "              ${PURPLE}#10/365 - Year Coding Challenge${NC}"
    echo ""
}

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║                                                                           ║
# ║   📦 DEPENDENCY CHECKS & INSTALLATION                                     ║
# ║                                                                           ║
# ║   The following section verifies all required tools are installed:        ║
# ║   • Homebrew (macOS package manager)                                      ║
# ║   • pnpm (fast, disk-efficient package manager)                           ║
# ║   • Node.js (JavaScript runtime)                                          ║
# ║                                                                           ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

check_dependencies() {
    print_step "🔍 Checking Dependencies"

    # ┌───────────────────────────────────────────────────────────────────────┐
    # │ 🍺 HOMEBREW CHECK (macOS only)                                        │
    # │ Homebrew is the package manager for macOS                             │
    # └───────────────────────────────────────────────────────────────────────┘
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if ! command_exists brew; then
            print_warning "Homebrew not found. Installing... 🍺"
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

            # 🍎 Add Homebrew to PATH for Apple Silicon Macs (M1/M2/M3/M4)
            if [[ -f "/opt/homebrew/bin/brew" ]]; then
                eval "$(/opt/homebrew/bin/brew shellenv)"
            fi
        else
            print_success "Homebrew is installed 🍺"
        fi
    fi

    # ┌───────────────────────────────────────────────────────────────────────┐
    # │ 🟢 NODE.JS CHECK                                                      │
    # │ Node.js 18+ is required to run the Next.js 16 application             │
    # └───────────────────────────────────────────────────────────────────────┘
    if ! command_exists node; then
        print_warning "Node.js not found. Installing... 🟢"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            brew install node
        else
            print_error "Please install Node.js 18+ manually: https://nodejs.org"
            exit 1
        fi
    else
        NODE_VERSION=$(node --version)
        print_success "Node.js is installed ($NODE_VERSION) 🟢"
    fi

    # ┌───────────────────────────────────────────────────────────────────────┐
    # │ 📦 PNPM CHECK                                                         │
    # │ pnpm is a fast, disk space efficient package manager for Node.js      │
    # └───────────────────────────────────────────────────────────────────────┘
    if ! command_exists pnpm; then
        print_warning "pnpm not found. Installing... 📦"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            brew install pnpm
        else
            npm install -g pnpm
        fi
    else
        PNPM_VERSION=$(pnpm --version)
        print_success "pnpm is installed (v$PNPM_VERSION) 📦"
    fi
}

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║                                                                           ║
# ║   📦 NPM DEPENDENCIES                                                     ║
# ║                                                                           ║
# ║   Install all Node.js packages required by the application                ║
# ║                                                                           ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

install_dependencies() {
    print_step "📦 Installing Node.js Dependencies"

    # 🔄 Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_info "Installing packages with pnpm..."
        pnpm install
        print_success "All dependencies installed!"
    else
        print_success "Dependencies already installed!"
        print_info "Run 'pnpm install' to update packages"
    fi
}

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║                                                                           ║
# ║   🚀 LAUNCH APPLICATION                                                   ║
# ║                                                                           ║
# ║   Start the Next.js development server with Turbopack                     ║
# ║                                                                           ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

start_dev_server() {
    print_step "🚀 Launching GitHub Stats Enhanced"

    # 🌐 Find available port
    PORT=3000
    while lsof -i :$PORT &>/dev/null; do
        PORT=$((PORT + 1))
    done

    if [ $PORT -ne 3000 ]; then
        print_warning "Port 3000 is in use, using port $PORT"
    fi

    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║${NC}                                                           ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}   ${BOLD}🎉 All systems ready!${NC}                                   ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}                                                           ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}   📱 App:  ${CYAN}http://localhost:$PORT${NC}                          ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}                                                           ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}   ${WHITE}Enter any GitHub username to explore their stats!${NC}     ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}                                                           ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}   ${BOLD}Features:${NC}                                               ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}   • 📊 Beautiful charts & heatmaps                         ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}   • 🏆 30+ achievement badges                              ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}   • ⚡ XP & leveling system                                ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}   • 🔮 Statistical predictions                             ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}   • ⚔️  Battle mode to compare devs                        ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}                                                           ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}   Press ${BOLD}Ctrl+C${NC} to stop the server                        ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}                                                           ${GREEN}║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""

    # 🚀 Start the Next.js development server with Turbopack
    PORT=$PORT pnpm dev
}

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║                                                                           ║
# ║   🏭 PRODUCTION BUILD & START                                             ║
# ║                                                                           ║
# ║   Build and run the optimized production version                          ║
# ║                                                                           ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

start_prod_server() {
    print_step "🏭 Building for Production"

    print_info "Creating optimized production build..."
    pnpm build

    print_success "Production build complete!"

    print_step "🚀 Starting Production Server"

    # 🌐 Find available port
    PORT=3000
    while lsof -i :$PORT &>/dev/null; do
        PORT=$((PORT + 1))
    done

    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║${NC}                                                           ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}   ${BOLD}🚀 Production server starting!${NC}                         ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}                                                           ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}   📱 App:  ${CYAN}http://localhost:$PORT${NC}                          ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}                                                           ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}   Press ${BOLD}Ctrl+C${NC} to stop the server                        ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}                                                           ${GREEN}║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""

    PORT=$PORT pnpm start
}

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║                                                                           ║
# ║   📋 HELP MENU                                                            ║
# ║                                                                           ║
# ║   Display usage information and available options                         ║
# ║                                                                           ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

show_help() {
    print_header
    echo -e "${WHITE}Usage:${NC} ./start.sh [option]"
    echo ""
    echo -e "${WHITE}Options:${NC}"
    echo -e "  ${CYAN}(none)${NC}       Start development server (default)"
    echo -e "  ${CYAN}--prod${NC}       Build and start production server"
    echo -e "  ${CYAN}--build${NC}      Build for production only"
    echo -e "  ${CYAN}-h, --help${NC}   Show this help message"
    echo ""
    echo -e "${WHITE}Examples:${NC}"
    echo -e "  ${CYAN}./start.sh${NC}           # Start dev server on localhost:3000"
    echo -e "  ${CYAN}./start.sh --prod${NC}    # Build and run production version"
    echo ""
    echo -e "${WHITE}Requirements:${NC}"
    echo -e "  • Node.js 18+"
    echo -e "  • pnpm (will be installed automatically)"
    echo ""
    echo -e "${WHITE}GitHub API:${NC}"
    echo -e "  • No authentication required"
    echo -e "  • Rate limit: 60 requests/hour (unauthenticated)"
    echo ""
}

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║                                                                           ║
# ║   🎯 MAIN SCRIPT ENTRY POINT                                              ║
# ║                                                                           ║
# ║   Parse command line arguments and execute the appropriate action         ║
# ║                                                                           ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

main() {
    case "${1:-}" in
        -h|--help)
            show_help
            exit 0
            ;;
        --prod)
            print_header
            check_dependencies
            install_dependencies
            start_prod_server
            ;;
        --build)
            print_header
            check_dependencies
            install_dependencies
            print_step "🏭 Building for Production"
            pnpm build
            print_success "Production build complete!"
            echo ""
            print_info "Run './start.sh --prod' to start the production server"
            echo ""
            ;;
        *)
            print_header
            check_dependencies
            install_dependencies
            start_dev_server
            ;;
    esac
}

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🚀 RUN THE SCRIPT                                                         │
# │ Pass all command line arguments to the main function                      │
# └───────────────────────────────────────────────────────────────────────────┘
main "$@"

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 👋 END OF SCRIPT                                                          │
# │ The script will continue running until the user presses Ctrl+C            │
# │ Thank you for using GitHub Stats Enhanced! 📊                             │
# └───────────────────────────────────────────────────────────────────────────┘
