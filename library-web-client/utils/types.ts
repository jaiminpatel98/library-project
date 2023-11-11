interface Media {
  id?: string,
  uid?: string,
  fileName?: string,
  status?: "processed" | "processing",
  title?: string,
  description?: string,
  type?: string,
  date?: number
};

interface Video extends Media {};

interface User {
  uid: string,
  name?: string,
  bio?: string,
  photoUrl?: string,
  email?: string
}

interface Toast {
  title: string,
  message: string,
  type: string
}