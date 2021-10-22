let alphafit = new Set(Array.from('qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'))

let iterator = 0

function isPangram(string){
  for(x of string){
   if (alphafit.delete(x)){
       iterator++
   }
  }
  if(iterator >= 26){
    return true
  }else{
    return false
  }
  
}
console.log(    isPangram('The quick brown fox jumps over the lazy dog.')   );
