# MySQL Installation Guide for Windows

## 🎯 Step 1: Download MySQL

1. **Open your browser and go to:**
   https://dev.mysql.com/downloads/installer/

2. **Download the installer:**
   - Click on "MySQL Installer for Windows"
   - Choose: **mysql-installer-community-8.0.xx.msi** (larger file, ~400MB)
   - Click "Download"
   - Click "No thanks, just start my download"

## 🔧 Step 2: Install MySQL

1. **Run the downloaded installer** (mysql-installer-community-8.0.xx.msi)

2. **Choose Setup Type:**
   - Select: **"Developer Default"**
   - Click "Next"

3. **Check Requirements:**
   - Click "Execute" to install any missing requirements
   - Click "Next" when done

4. **Installation:**
   - Click "Execute" to install MySQL components
   - Wait for installation to complete
   - Click "Next"

5. **Product Configuration:**
   - Click "Next" to start configuration

6. **Type and Networking:**
   - Config Type: **Development Computer**
   - Port: **3306** (default)
   - Click "Next"

7. **Authentication Method:**
   - Choose: **Use Strong Password Encryption**
   - Click "Next"

8. **Accounts and Roles:**
   - Set MySQL Root Password: **[IMPORTANT: Remember this!]**
   - Re-enter password to confirm
   - Click "Next"

9. **Windows Service:**
   - Keep defaults:
     - ✅ Configure MySQL Server as a Windows Service
     - ✅ Start the MySQL Server at System Startup
   - Click "Next"

10. **Apply Configuration:**
    - Click "Execute"
    - Wait for all steps to complete (green checkmarks)
    - Click "Finish"

11. **Product Configuration (continued):**
    - Click "Next"
    - Click "Finish"

12. **Installation Complete:**
    - Click "Finish"

## ✅ Step 3: Verify Installation

Open PowerShell and run:

```powershell
# Check if MySQL is running
Get-Service MySQL80

# Should show: Status = Running
```

## 🔄 Alternative: Install via Chocolatey (Faster)

If you have Chocolatey installed:

```powershell
# Run PowerShell as Administrator
choco install mysql

# Start MySQL service
net start MySQL80
```

## 📝 Step 4: Update Your .env File

After installation, update your `.env` file:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=studyhub
DB_USER=root
DB_PASSWORD=your_mysql_root_password_here
```

**Replace `your_mysql_root_password_here` with the password you set during installation!**

## 🚀 Step 5: Install mysql2 Package

```bash
cd server
npm install mysql2
```

## ✅ Step 6: Run Database Setup

```bash
node src/database/setup-mysql.js
```

---

## 🎯 What to Do Now

1. **Download MySQL** from the link above
2. **Install it** following the steps
3. **Remember your root password!**
4. **Come back here** when installation is complete

I'll help you with the next steps after MySQL is installed! 🚀


