import { supabase } from './supabase'
import type { Database } from './types/database'

// Generic database operations
export class DatabaseService {
  // Get data from table
  static async get<T>(
    table: keyof Database['public']['Tables'],
    select = '*',
    filters?: Record<string, string | number | boolean | null>
  ) {
    let query = supabase.from(table as string).select(select)
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }
    
    const { data, error } = await query
    
    if (error) {
      throw new Error(`Error fetching from ${table}: ${error.message}`)
    }
    
    return data as T[]
  }

  // Insert data to table
  static async insert<T>(
    table: keyof Database['public']['Tables'],
    data: Partial<T>
  ) {
    const { data: result, error } = await supabase
      .from(table as string)
      .insert(data)
      .select()
      .single()
    
    if (error) {
      throw new Error(`Error inserting to ${table}: ${error.message}`)
    }
    
    return result as T
  }

  // Update data in table
  static async update<T>(
    table: keyof Database['public']['Tables'],
    id: string | number,
    data: Partial<T>
  ) {
    const { data: result, error } = await supabase
      .from(table as string)
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      throw new Error(`Error updating ${table}: ${error.message}`)
    }
    
    return result as T
  }

  // Delete data from table
  static async delete(
    table: keyof Database['public']['Tables'],
    id: string | number
  ) {
    const { error } = await supabase
      .from(table as string)
      .delete()
      .eq('id', id)
    
    if (error) {
      throw new Error(`Error deleting from ${table}: ${error.message}`)
    }
    
    return true
  }

  // Get single record by ID
  static async getById<T>(
    table: keyof Database['public']['Tables'],
    id: string | number
  ) {
    const { data, error } = await supabase
      .from(table as string)
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      throw new Error(`Error fetching ${table} by ID: ${error.message}`)
    }
    
    return data as T
  }
}

// Specific services for portfolio data
export class PortfolioService {
  // Get all projects
  static async getProjects() {
    return DatabaseService.get('projects')
  }

  // Get project by ID
  static async getProject(id: string) {
    return DatabaseService.getById('projects', id)
  }

  // Add new project
  static async addProject(
    project: Database['public']['Tables']['projects']['Insert']
  ) {
    return DatabaseService.insert<Database['public']['Tables']['projects']['Row']>(
      'projects',
      project
    )
  }

  // Update project
  static async updateProject(
    id: string,
    project: Database['public']['Tables']['projects']['Update']
  ) {
    return DatabaseService.update<Database['public']['Tables']['projects']['Row']>(
      'projects',
      id,
      project
    )
  }

  // Delete project
  static async deleteProject(id: string) {
    return DatabaseService.delete('projects', id)
  }

  // Get all skills
  static async getSkills() {
    return DatabaseService.get('skills')
  }

  // Get all experiences
  static async getExperiences() {
    return DatabaseService.get('experiences')
  }

  // Get all testimonials
  static async getTestimonials() {
    return DatabaseService.get('testimonials')
  }

  // Get all articles
  static async getArticles() {
    return DatabaseService.get('articles')
  }
}
