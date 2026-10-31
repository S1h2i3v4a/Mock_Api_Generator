Link:-  https://mock-api-generator-62q1.onrender.com


Problem Statement & Solution


[ Traditional Problem ]
Frontend Devs ──(Waiting for Backend)──> Blocked / Hardcoded Fake JSON Files
                                           │
                                           └──> Later code rewrite needed!

[ Mock-Craft Engine Solution ]
Frontend Devs ──(Hits Real HTTP Endpoint)──> Mock-Craft Engine ──> Real Configured JSON Response
                                                                    (Zero Frontend Code Change Later)


Problem: Jab frontend developers project start karte hain, backend APIs aksar ready nahi hoti. Developers temporary frontend code mein dummy JSON hardcode karte hain, jise baad mein backend aane par clean-up karna padta hai.
Solution (Mock-Craft Engine): Ye ek SaaS tool hai jahan user dashboard se koi bhi endpoint (e.g., GET /api/v1/users, POST /api/v1/orders), uska status code (200, 201, 404, 500) aur JSON response define karke save karega. Backend is configuration ko database mein store karega aur runtime par dynamically serve karega jaise ki ek real backend API ho.



4. System Architecture (MERN Flow)
Mock-Craft Engine 4 core layers mein divide hoga:


┌────────────────────────────────────────────────────────────────────────┐
│                          1. CLIENT LAYER                               │
│        (React Dashboard  OR  External App / Postman / cURL)            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP Request (e.g. GET /mock/...)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          2. BACKEND LAYER                              │
│                         (Node.js + Express)                            │
│  ┌────────────────────────┐          ┌──────────────────────────────┐  │
│  │   Management Routes    │          │      Dynamic Mock Engine     │  │
│  │ (CRUD for Endpoints)   │          │ (Wildcard Route Interceptor) │  │
│  └───────────┬────────────┘          └──────────────┬───────────────┘  │
│              │                                      │                  │
│              └───────────────┐      ┌───────────────┘                  │
│                              ▼      ▼                                  │
│                   ┌───────────────────────┐                            │
│                   │  Analytics Middleware │                            │
│                   └──────────┬────────────┘                            │
└──────────────────────────────┼─────────────────────────────────────────┘
                               │ Mongoose ODM
                               ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         3. DATABASE LAYER                              │
│                            (MongoDB)                                   │
│  ┌──────────────────────────────────┐ ┌──────────────────────────────┐ │
│  │     Endpoint Configurations      │ │         Request Logs         │ │
│  │  (path, method, status, body)    │ │   (timestamp, latency, IP)   │ │
│  └──────────────────────────────────┘ └──────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘


Endpoint Creation: User React Dashboard mein endpoint define karta hai:
Path: /api/v1/products
Method: GET
Status Code: 200
Response Body: [{"id": 1, "name": "Laptop", "price": 50000}]
Database Storage: Backend Express API is configuration ko MongoDB ke endpoints collection mein save karegi.
Mock Request Execution: Jab koi client (Postman/Frontend) hit karega:
http


GET http://localhost:5000/mock/user_101/api/v1/products
Dynamic Path Matching: Express ka Catch-All Mock Engine request ko intercept karega, URL path (/api/v1/products) aur method (GET) extract karega, aur MongoDB mein query karega.
Dynamic Response & Latency: Agar configuration milti hai, toh wahi status code (200) aur configured JSON response client ko return hoga (agar custom delay set kiya ho, toh utna delay simulate hoga).
Analytics Logging: Analytics middleware background mein log create karega (status code, response time, endpoint hit count) jo dashboard ke charts par reflect hoga.

6. Role of Technologies
Technology	Role is Project Mein
Node.js	Asynchronous JavaScript runtime environment jo server-side JavaScript execute karta hai.
Express.js	Minimalist web framework jo routing, custom middlewares, aur dynamic catch-all matching handle karega.
MongoDB	NoSQL Document database jo flexible JSON data structure aur API configurations store karne ke liye ideal hai.
Mongoose	Object Data Modeling (ODM) library jo MongoDB ke schema validation, relations aur queries ko manage karegi.
React.js	Component-based UI library jisse API configuration dashboard aur endpoint builder banega.
Tailwind CSS	Utility-first CSS framework fast aur modern UI styling ke liye.
Recharts	Data visualization library jo endpoint usage aur response times ke charts render karegi.
