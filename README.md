# Gym Buddy

A personal workout tracker for logging sets, reps and progress. Built with Claude as an experiment, with data stored in Supabase.

## What it does

- **Workout:** pick the day of your program, log weight, reps and RIR for each set, with last time's numbers pre-filled and a rest timer.
- **History:** every session, grouped by program.
- **Progress:** per-exercise charts of top set and estimated 1-rep max, with comparison between programs.
- **Programs:** the current plan and past ones, written as simple editable text.

## How it's built

- A single-page web app (`index.html`), installable on Android as a PWA (`manifest.webmanifest`, `sw.js`). It works offline and syncs when the connection is back.
- Hosted on GitHub Pages.
- Data lives in a [Supabase](https://supabase.com) database. Each user signs in with email and password, and row-level security makes sure every account can only read and write its own rows.

## Privacy

This repository contains only the app's code. No workout data is stored here. The Supabase key in `index.html` is a publishable key, which is designed to be public: on its own it can't read any data without a signed-in user.
