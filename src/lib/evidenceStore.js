/**
 * In-memory store for active file Blobs during the citizen reporting session.
 * Keeps raw File/Blob instances out of Redux to maintain clean state serialization.
 */

const fileMap = new Map()

export const evidenceStore = {
  addFile(id, file) {
    fileMap.set(id, file)
  },
  getFile(id) {
    return fileMap.get(id)
  },
  removeFile(id) {
    fileMap.delete(id)
  },
  clear() {
    fileMap.clear()
  },
  getAllFiles() {
    return Array.from(fileMap.entries()).map(([id, file]) => ({ id, file }))
  }
}
