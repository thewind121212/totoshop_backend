export const removeDiacritics = (str : string) => {
    let newStr = str.replace(/-/g,"")
    newStr = newStr.replace(/\s+/g, '-')
    return newStr.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  }