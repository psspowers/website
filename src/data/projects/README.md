# Project Grid Implementation

## Architecture Overview

The project grid implementation follows a modular architecture with clear separation of concerns:

1. **Data Layer** (`/src/data/projects/`)
   - `types.ts`: Type definitions
   - `projects.ts`: Project data
   - `regions.ts`: Region definitions
   - `validation.ts`: Data validation
   - `utils.ts`: Utility functions
   - `index.ts`: Main export

2. **Components** (`/src/components/`)
   - `ProjectCard.astro`: Individual project display
   - `ProjectMap.astro`: Interactive map view
   - `OptimizedImage.astro`: Image optimization

3. **Page** (`/src/pages/projects.astro`)
   - Main projects page with filtering and view switching

## Key Features

- Responsive grid layout
- Advanced filtering system
- Interactive map view
- Optimized images with loading states
- Animated statistics
- Type-safe implementation

## Performance Optimizations

1. Image Loading
   - Progressive loading
   - Proper aspect ratios
   - Optimized formats
   - Lazy loading for off-screen content

2. Animations
   - Hardware-accelerated transforms
   - Efficient transitions
   - Reduced layout shifts

3. Filtering
   - Client-side filtering for instant feedback
   - Debounced updates
   - Efficient DOM updates

## Maintenance Guidelines

1. Adding New Projects
   ```typescript
   // Add to src/data/projects/projects.ts
   export const projects: Project[] = [
     // Follow existing structure
     {
       name: 'New Project',
       capacity: '0.00 MWp',
       type: 'Solar Rooftop', // Use existing types
       status: 'In Progress',
       cod: 'Q1 2025',
       role: 'EPC',
       location: 'Bangkok, Thailand',
       image: '/project-images/new-project.webp'
     }
   ];
   ```

2. Adding New Regions
   ```typescript
   // Add to src/data/projects/regions.ts
   export const regions: Record<string, Region> = {
     'New Region': {
       name: 'New Region',
       locations: ['City, Country'],
       description: 'Region description'
     }
   };
   ```

3. Modifying Card Layout
   - Update `ProjectCard.astro` component
   - Maintain consistent spacing (8-10px vertical)
   - Keep information box height under 120px
   - Use standard font sizes (labels: 14px, values: 16px)

4. Image Requirements
   - Format: WebP preferred
   - Aspect ratio: 16:9
   - Resolution: 800x450px minimum
   - Optimization: Enable compression

## Testing Checklist

- [ ] Responsive layout (mobile, tablet, desktop)
- [ ] Filter functionality
- [ ] Image loading states
- [ ] Animation performance
- [ ] Map interaction
- [ ] Type validation
- [ ] Error handling

## Future Considerations

1. Performance Monitoring
   - Add analytics for user interactions
   - Monitor image loading performance
   - Track filter usage

2. Potential Enhancements
   - Advanced search functionality
   - Additional view options
   - More detailed project information
   - Export capabilities

3. Maintenance Tasks
   - Regular data validation
   - Image optimization checks
   - Performance audits
   - Type safety verification