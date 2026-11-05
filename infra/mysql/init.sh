# infra/mysql/init.sh
# !/bin/bash
set -e

mysql -u root -p"${MYSQL_ROOT_PASSWORD}" <<EOF
CREATE DATABASE IF NOT EXISTS attendance_db;
CREATE DATABASE IF NOT EXISTS auth_db;
CREATE DATABASE IF NOT EXISTS employee_db;

CREATE USER IF NOT EXISTS 'attendance_svc'@'%' IDENTIFIED BY '${ATTENDANCE_DB_PASSWORD}';
CREATE USER IF NOT EXISTS 'auth_svc'@'%' IDENTIFIED BY '${AUTH_DB_PASSWORD}';
CREATE USER IF NOT EXISTS 'employee_svc'@'%' IDENTIFIED BY '${EMPLOYEE_DB_PASSWORD}';

GRANT ALL PRIVILEGES ON auth_db.* TO 'auth_svc'@'%';
GRANT ALL PRIVILEGES ON employee_db.* TO 'employee_svc'@'%';
GRANT ALL PRIVILEGES ON attendance_db.* TO 'attendance_svc'@'%';
FLUSH PRIVILEGES;
EOF

