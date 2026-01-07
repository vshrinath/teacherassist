---
description: Deploy GemTeach to Google Cloud Run
---

// turbo-all

# Deploy to Google Cloud Run

This workflow guides you through deploying the GemTeach application to Google Cloud Run. 

> [!IMPORTANT]
> This version uses **Google Cloud Firestore** for data persistence. Ensure that your Google Cloud Project has Firestore enabled in **Native Mode**.

### Prerequisites
1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed and authenticated.
2. A Google Cloud Project with Billing enabled.
3. `gcloud`, `docker`, and `npm` installed.

### Step 1: Set Environment Variables
```bash
export PROJECT_ID=shishu-mandir-42
export SERVICE_NAME=gemteach
export REGION=asia-south1
```

### Step 2: Enable Required Services
```bash
gcloud services enable run.googleapis.com \
    containerregistry.googleapis.com \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com \
    firestore.googleapis.com
```

### Step 3: Create Firestore Database (if not exists)
```bash
gcloud firestore databases create --location=$REGION --type=firestore-native
```

### Step 4: Build and Push to Artifact Registry
We will use Cloud Build to build the image and push it to Artifact Registry.

1. Create the repository:
```bash
gcloud artifacts repositories create gemteach-repo \
    --repository-format=docker \
    --location=$REGION \
    --description="GemTeach Docker repository"
```

2. Build and push:
```bash
gcloud builds submit --tag $REGION-docker.pkg.dev/$PROJECT_ID/gemteach-repo/$SERVICE_NAME .
```

### Step 4: Deploy to Cloud Run
```bash
gcloud run deploy $SERVICE_NAME \
    --image $REGION-docker.pkg.dev/$PROJECT_ID/gemteach-repo/$SERVICE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated
```

### Step 5: Access your Service
Once the deployment is complete, `gcloud` will provide a URL like `https://gemteach-[hash].a.run.app`.

- **Admin Panel**: `https://gemteach-[hash].a.run.app/admin`
- **Dashboard**: `https://gemteach-[hash].a.run.app`
