#!/bin/bash

# PI-HUB Web Services Organization Setup Script
# This script helps set up the GitHub organization for the agency

set -e

echo "🚀 PI-HUB Web Services Organization Setup"
echo "=========================================="

# Check for GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI not found. Please install it first:"
    echo "   https://cli.github.com/"
    exit 1
fi

# Check authentication
echo "🔐 Checking GitHub authentication..."
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI"
    echo "   Please run: gh auth login"
    exit 1
fi

echo "✅ Authenticated with GitHub"

# Display current user
CURRENT_USER=$(gh api /user --jq '.login')
echo "👤 Current user: $CURRENT_USER"

echo ""
echo "📋 Organization Creation Options"
echo "-------------------------------"
echo "1. Create via GitHub Web Interface (Recommended)"
echo "2. Check API capabilities"
echo "3. View current organizations"
echo "4. Exit"
echo ""

read -p "Select option (1-4): " option

case $option in
    1)
        echo ""
        echo "🌐 Opening GitHub organization creation page..."
        echo "   Please visit: https://github.com/account/organizations/new"
        echo ""
        echo "📝 Required information:"
        echo "   - Organization name: PI-HUB-Web"
        echo "   - Billing email: isurum.aus@gmail.com"
        echo "   - Plan: Start with Free plan"
        echo ""
        echo "🔗 Once created, you can transfer the repository:"
        echo "   Settings → Transfer ownership → Select 'PI-HUB-Web'"
        ;;
    2)
        echo ""
        echo "🔍 Checking API capabilities..."
        
        # Check if user can create organizations
        echo "Testing organization creation endpoint..."
        RESPONSE=$(curl -s -H "Authorization: token $(gh auth token)" \
            -X POST https://api.github.com/user/orgs \
            -d '{"login":"test-org-check","name":"Test"}' \
            -w "%{http_code}" -o /dev/null)
        
        if [ "$RESPONSE" = "404" ]; then
            echo "❌ Organization creation not available via API"
            echo "   This typically means:"
            echo "   - You need GitHub Pro account"
            echo "   - Organization creation restricted for your account"
            echo "   - API endpoint requires different permissions"
            echo ""
            echo "💡 Recommendation: Use web interface instead"
        elif [ "$RESPONSE" = "403" ]; then
            echo "❌ Permission denied"
            echo "   Your token doesn't have organization creation permissions"
        elif [ "$RESPONSE" = "422" ]; then
            echo "⚠️  Organization name might be taken or invalid"
            echo "   But API endpoint is accessible"
        else
            echo "✅ API endpoint accessible (HTTP $RESPONSE)"
            echo "   Organization creation might be possible via API"
        fi
        ;;
    3)
        echo ""
        echo "🏢 Listing current organizations..."
        gh api /user/orgs --jq '.[].login' || echo "No organizations found or cannot access"
        ;;
    4)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "📚 Additional Resources:"
echo "   - GitHub Docs: https://docs.github.com/en/organizations"
echo "   - Vercel Setup: See DEPLOYMENT.md"
echo "   - Supabase: https://supabase.com/docs"
echo ""
echo "🎯 Next Steps:"
echo "   1. Create GitHub organization 'PI-HUB-Web'"
echo "   2. Transfer repository to organization"
echo "   3. Set up Supabase project"
echo "   4. Configure Vercel deployment"
echo "   5. Purchase and configure domain"