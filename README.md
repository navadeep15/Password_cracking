# Password Cracking Guide

## Overview

These methods demonstrate how attackers exploit weak passwords to gain unauthorized access to systems. It is critical to understand these techniques to build effective defenses against them.

---

## Cloning the Sample Login Page

Clone the sample login page repository:

```bash
git clone https://github.com/navadeep15/Password_cracking
```

Navigate to the correct directory:

```bash
cd login-app
```

Install dependencies:

```bash
npm i
```

Start the server:

```bash
node app.js
```

The server will start at port **8080**. Open a browser and navigate to:

```
http://localhost:8080
```

to see the login page.

---

## 1. Brute Force Attack

### Description

A brute force attack systematically tries every possible combination of characters to guess a password. This method is time-consuming for complex passwords but can be effective against weak or short passwords.

### Example

A hacker can try all password combinations, such as `a`, `aa`, `ab`, `ac`, and so on.

### Steps to Perform a Brute Force Attack Using Hydra:

1. Open a terminal in Kali Linux.

2. Use the following command:

   ```bash
   hydra -l admin -x 3:3:a 10.0.54.91 -s 8080 http-post-form "/login:username=^USER^&password=^PASS^:F=Invalid Login" -V
   ```

   - Replace `10.0.54.91` with the IP address of the target web server.
   - Replace `8080` with the port number of the target web server.

3. The option `-x 3:3:a` specifies that Hydra will try all possible 3-letter combinations of lowercase alphabets.

4. To try passwords of length 1 to 6 containing lowercase, uppercase, numbers, and special characters, use:

   ```bash
   -x 1:6:aA1@
   ```

5. For demonstration purposes, replace the password in `app.js` with a simple password (e.g., `abc`) to see how the attack works.

---

## 2. Dictionary Attack

### Description

A dictionary attack uses a precompiled list of commonly used passwords or phrases, known as a "dictionary," to guess a password. This method is faster than brute force for predictable passwords.

### Steps to Perform a Dictionary Attack Using Hydra:

1. Locate the wordlist `rockyou.txt` (commonly used in password attacks):

   ```bash
   cd /usr/share/wordlists
   ```

2. Use the following Hydra command:

   ```bash
   hydra -l admin -P rockyou.txt -t 4 -w 30 192.168.162.245 -s 8080 http-post-form "/login:username=^USER^&password=^PASS^:F=Invalid login" -V
   ```

   - Replace `192.168.162.245` with the IP address of the target web server.
   - Replace `8080` with the port number of the target web server.

3. Hydra will try all passwords in the `rockyou.txt` wordlist until it finds the correct one.

---

## 3. Hashcat Attack

### Description

**Hashing**: Websites store hashed versions of passwords for security. When logging in, the password entered is hashed and compared to the stored hash. Hashcat attempts to find a password that generates a given hash.

### Steps to Perform a Hashcat Attack:

1. Use the following Hashcat command:

   ```bash
   hashcat -m 0 hash.txt rockyou.txt --show
   ```

   - `-m 0`: Specifies the hash type (MD5 in this case).
   - `rockyou.txt`: Wordlist containing potential passwords.
   - `hash.txt`: File containing the hash to crack.

2. Hashcat will match passwords from `rockyou.txt` with the hash in `hash.txt` to find the correct password.

---

## 4. Prevention Measures

### Implementing Rate Limiting

Rate limiting can prevent brute force and dictionary attacks by limiting the number of login attempts from an IP address within a specified time frame.

### Steps to Test Rate Limiting:

1. Navigate to the directory with rate limiting implemented:

   ```bash
   cd ..
   cd with_rate_limiting
   ```

2. Start the server:

   ```bash
   node app.js
   ```

3. The rate limiting is implemented using the `express-rate-limit` module. It:

   - Defines a **window size** (in milliseconds).
   - Specifies the maximum number of login requests allowed from each IP address within the window size.

4. Attempt brute force and dictionary attacks against this server. The attacks should fail due to rate limiting.

---
### Additional Resources

For more detailed insights, refer to the presentation included in this repository:

`ICS Presentation.pdf`: Provides an overview of these techniques and additional context.

---

## Thank You



