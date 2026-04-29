export type Charity = {
  id:          string
  name:        string
  description: string | null
  image_url:   string | null
  is_featured: boolean
  is_active:   boolean
  created_at:  string
}
