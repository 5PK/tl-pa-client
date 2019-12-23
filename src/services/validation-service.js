function validateEmail (email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateEmpty (input) {
  
  if(input == ""){
    console.log(input.length)
    return false
  }else{
    return true
  }
}


export { 
  validateEmail,
  validateEmpty
};
