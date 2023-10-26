interface Media {
  id?: string,
  uid?: string,
  fileName?: string,
  status?: "processed" | "processing",
  title?: string,
  description?: string,
  date?: number
};

interface Video extends Media {};