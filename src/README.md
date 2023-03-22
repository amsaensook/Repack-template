# Structure Process Authorize to Page

- index 								// Provider, Global State, Global Function API
- App 									// Route to Page
- ProtectedRoute				        // Check auth state protect route to Page incorrect (Ignore Login Page)
- IdleTimerContainer		            // Observe user idle, Check refresh token, Check expire token
- pages									// Page as Main

# Structure Process Call API 

- Component, Page				        // Call Hook
- Hook									// Use React-Query call function API
- axios									// Request API and response data
- service axios					        // Interceptors before request and response (middleware)

# Structure Process Import Page or Component

- index                                 // Export default from Page, Use import instead Page
- Page                                  // Page as Main

# Structure Process Route to Template

- App (Routes)                          // Main Routes to Pages
- Pages (as Setting)                    // Get Permission to Component Template by props
- Components (Template)                 // Generate Menu from Permission

# Structure CSS in AntD

- Tailwind (in line)                    // Use when css little
- Tailwind (css file)                   // Use when css a lot
- TailwindStyleComponent (in file)      // Use when css and logic with Component little
- TailwindStyleComponent (tsx file)     // Use when css and logic with Component a lot

Note: but not use css Tailwind in some Component AntD

- JS Style (in line)                    // Use when css little
- JS Style Object (in file)             // Use when css repeat little
-* JS Style Component (in file)
-* JS Style Component (tsx file)

# Structure Process Redirect to Component Page

- Check part is null. Not generate Route. Redirect to 404 page (Part : /Blank) 
- Check part is not null. Generate Route. But not set page component in DynamicMenu. Redirect to 404 page (Part : /{Part form API}) 
- Check part is not null. Generate Route. Set page component in DynamicMenu.Redirect to component page (Part : /{Part form API})

Note: all everything do in parent 