# 🚀 Jabecha Events – Migration to Cursor AI (Starting from Scratch)

## 📌 Project Objective

Jabecha Events is a mobile-first funeral and event management platform tailored for the African market. We are building this app **from scratch** in **Cursor AI**, using **React Native (Expo)** and **Firebase** as our core technologies.

This document provides the **full development context** and marks the starting point for coding the entire application.

---

## ✅ Project Phase Overview

We are beginning from **Phase 1: UI & Theming Setup**. The following features will be developed modularly, in structured phases, with testability and scalability as key priorities.

---

## 🧱 Folder Structure

```
/src
  /screens
  /components
  /context
  /firebase
  /hooks
  /theme
  /utils
  /services
  /assets
/tests
App.tsx
app.config.js
```

---

## 🧠 Core Features

### 🔐 Authentication
- Email/password login/signup
- Password reset

### 🪦 Event Management
- Create/edit/delete events
- Firestore document + image

### 📝 Program Builder
- Input form → auto-generated PDF
- Firebase Storage link

### 📸 Gallery
- Upload multiple images
- Per-event gallery support

### 📦 Marketplace
- Service listings (tent hire, catering, etc.)
- Contact via WhatsApp

### 🔔 Notifications
- OneSignal push
- Trigger on new events

### 📤 Sharing
- QR code generation
- WhatsApp sharing

### 👤 Profile
- View/update user info
- View own listings/events

---

## 🎨 UI Framework & Theming

We are using **React Native Paper** to implement our UI system.

### Initial Deliverables:
- `/theme/theme.ts`: custom Paper theme with colors, fonts, spacing
- `App.tsx`: wrapped with `PaperProvider`, `NavigationContainer`
- `/components/ui/JButton.tsx`: reusable button
- `/components/ui/JInput.tsx`: styled text input
- `JScreen`: wrapper with SafeArea and padding

---

## ✅ Cursor AI Action Plan

You will help build:
1. A modular, testable, and production-ready React Native (Expo) app
2. Firebase integration: Auth, Firestore, Storage
3. Full screen-level code (no placeholders)
4. Expo-compatible features like image picking, push notifications, and PDF generation

Let’s begin from scratch, starting with **theming and UI setup**.
