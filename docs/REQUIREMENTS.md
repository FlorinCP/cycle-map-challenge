                                                     # Front-End Code Challenge Requirements Checklist

Use this checklist to track completion of the challenge requirements. Aiming for Mid/Senior level means completing **all** base requirements plus **all** Mid/Senior additions.

---

### 1. Core Objective

-   [ ] Create a React SPA (Next.js App Router) displaying bicycle network info.

---

### 2. Technical Stack (Required for All Levels)

-   [ ] **Framework:** Next.js (App Router)
-   [ ] **Language:** TypeScript
-   [ ] **Styling:** Tailwind CSS
-   [ ] **UI Components:** Shadcn/ui

---

### 3. Data Sources (Required for All Levels)

-   [ ] Fetch Network List: `https://api.citybik.es/v2/networks`
-   [ ] Fetch Network Details (incl. stations): `https://api.citybik.es/v2/networks/{network_id}`
-   [ ] Utilize provided `data` folder for Country Data.

---

### 4. Design Specifications (Required for All Levels)

-   [ ] Implement UI based on provided Figma designs:
    -   [ ] Match the [Interactive prototype](https://www.figma.com/proto/0MNqMneHvxahQZ6pknjzlq/Frontend-Challenge?page-id=1166%3A4310&node-id=5110-10913&viewport=4865%2C-2607%2C0.79&t=UlhDbVzZT1c5dezR-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=5110%3A10913).
    -   [ ] Use components/styles from the [UI kit](https://www.figma.com/design/0MNqMneHvxahQZ6pknjzlq/Frontend-Challenge?node-id=1166-4310).
-   [ ] Ensure close attention to layout, spacing, and component styling.

---

### 5. Deliverables & Submission (Required for All Levels)

-   [ ] Create a Git repository (e.g., GitHub).
-   [ ] Deploy application to a public URL (e.g., Vercel).
-   [ ] Submit links to **both** repository and deployed application.
-   [ ] Submit within **one week** (notify if delays expected).
-   [ ] Include a comprehensive `README.md`:
    -   [ ] Project/Feature description.
    -   [ ] Setup/Running instructions.
    -   [ ] Architectural choices explanation.
    -   [ ] Challenges faced discussion.
    -   [ ] Link to deployed application and repository.

---

### 6. Functional Requirements: Main View

#### 6.1. Base Requirements (Junior & Above)

-   [ ] Display a list of all bicycle networks.
-   [ ] List item shows: Network Name, Location (City, Country), Operating Companies.
-   [ ] List item links to its specific Detail View.
-   [ ] **Layout Constraint:** Leave designated space for map per design, but **do not implement map visualization** (Junior only).

#### 6.2. Additional Requirements (Mid/Senior Only)

-   [ ] **Map Implementation:** Implement interactive map showing markers for all networks.
-   [ ] **Map/List Interaction:** Clicking network marker OR list item navigates to Detail View.
-   [ ] **Country Filter:**
    -   [ ] Implement filter mechanism (e.g., dropdown) for single country selection.
    -   [ ] Filter affects **both** network list and map markers.
    -   [ ] Store selected country in URL (e.g., `?country=FR`).
    -   [ ] Ensure filter persists on reload based on URL parameter.
-   [ ] **Search Filter:**
    -   [ ] Implement search input field.
    -   [ ] Search affects **both** network list and map markers.
    -   [ ] Search matches Network Name and Company Name(s).
    -   [ ] Store search keyword in URL (e.g., `?search=velib`).
    -   [ ] Ensure filter persists on reload based on URL parameter.

---

### 7. Functional Requirements: Detail View

#### 7.1. Base Requirements (Junior & Above)

-   [ ] **URL Accessibility:** Detail View accessible via unique network URL (e.g., `/networks/network-id`).
-   [ ] **General Information:** Display Name, Companies, Location for the selected network.
-   [ ] **Station List:** Display list of all stations for the network.
-   [ ] Station list item shows: Station Name, Free Bikes, Empty Slots.
-   [ ] **Navigation:** Include button/link to go back to Main View.
-   [ ] **Layout Constraint:** Leave designated space for map per design, but **do not implement map visualization** (Junior only).

#### 7.2. Additional Requirements (Mid/Senior Only)

-   [ ] **Map Implementation:** Implement interactive map showing markers for all stations of the current network.
-   [ ] **Map Interaction:** Clicking station marker opens tooltip/popup showing Station Name, Free Bikes, Empty Slots.

---

### 8. Bonus Features (Optional)

#### 8.1. Main View Bonuses

-   [ ] **(Junior Only) Search Filter (List Only):**
    -   [ ] Implement search input affecting the *list* only.
    -   [ ] Search against Network Name/Company Name.
    -   [ ] Store keyword in URL (`?search=...`) for persistence.
-   [ ] **(All Levels) Pagination (Networks):** Implement pagination for the network list.
-   [ ] **(Mid/Senior Only) Map Centering:** Add function to center/zoom map on user's location.

#### 8.2. Detail View Bonuses

-   [ ] **(All Levels) Pagination (Stations):** Implement pagination for the station list.
-   [ ] **(All Levels) Sorting (Stations):** Allow sorting station list by:
    -   [ ] Free bikes (asc/desc).
    -   [ ] Empty slots (asc/desc).

---

### 9. Evaluation Criteria (Applies to All - Expectations scale with level)

-   [ ] **Type Safety:** Effective TypeScript usage.
-   [ ] **Data Management:** Sensible data fetching, state handling (loading, error, success).
-   [ ] **State Management:** Clear and appropriate strategy.
-   [ ] **Navigation & URL Handling:** Correct routing, URL parameter usage.
-   [ ] **Styling & Design Adherence:** Accuracy matching Figma, polish.
-   [ ] **Code Quality:** Clean, readable, maintainable, well-structured code.
-   [ ] **Performance:** Considerations implemented.
-   [ ] **Accessibility:** Basic principles followed.
-   [ ] **Robustness:** Handling of edge cases (API errors, no data).
-   [ ] **README Quality:** Clear and comprehensive documentation.
-   [ ] **Git History:** Clean and logical commits.