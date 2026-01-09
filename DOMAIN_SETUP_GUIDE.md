# Linking Your Custom Domain: teacherassist.co.in

To make your application accessible at `https://teacherassist.co.in`, we need to use **Firebase Hosting** as a "bridge." This is because the Mumbai region (`asia-south1`) currently has limitations for direct Cloud Run domain mapping.

Firebase Hosting is **free**, global, and handles SSL certificates automatically.

## Step 0: Verify Domain Ownership
*   **Status: COMPLETED** (I saw your screenshot from Search Console).

## Step 0.5: Link Google Cloud to Firebase
Your project `shishu-mandir-42` is currently a Google Cloud project. You need to "add" it to Firebase:

1.  In the [Firebase Console](https://console.firebase.google.com/), click **Add project**.
2.  In the project name field, click the **dropdown arrow** and look for `shishu-mandir-42`.
3.  Select it and click **Continue**.
4.  Follow the simple onboarding steps (you can disable Google Analytics for now to move faster).
5.  Once done, you will see the project in your dashboard.

## Step 1: Link Domain via Firebase Hosting
Now that the project is in Firebase:

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Select your project: **shishu-mandir-42**.
3.  In the left sidebar, go to **Build > Hosting**.
4.  Click **Get Started** (if you haven't used Hosting before).
5.  Click **Add Custom Domain**.
6.  Enter `teacherassist.co.in`.
7.  **Skip** the "Verify Ownership" step (it should detect it automatically).
8.  Firebase will provide you with two **A-records** (IP addresses).

## Step 2: Update GoDaddy DNS
Now you need to replace your old setting with these new IP addresses.

1.  Log in to GoDaddy and go to your **DNS Management** for `teacherassist.co.in`.
2.  **Turn off** the "Forwarding with Masking" feature completely.
3.  In the DNS Records table, find the existing **A-record** (it likely says `@` and points to a GoDaddy IP).
4.  **Edit** that A-record to the first IP address provided by Firebase.
5.  **Add** a second A-record with:
    *   **Type**: A
    *   **Host**: @
    *   **Value**: (The second IP address from Firebase)
6.  (Optional) Add a CNAME for `www`:
    *   **Type**: CNAME
    *   **Host**: www
    *   **Value**: (Usually something like `shishu-mandir-42.web.app`)

## Step 3: Deployment (I will do this)
Once you have added the records in GoDaddy, please tell me. I will then:
1.  Create a `firebase.json` file in your project.
2.  Connect Firebase to your `gemteach` service.
3.  Deploy the final configuration.

---
**Please let me know once you have the IP addresses from the Firebase Console!**
