import { nanoid } from 'nanoid'

const generateUniqueString = length => {
  return nanoid(length)
}

export default generateUniqueString
