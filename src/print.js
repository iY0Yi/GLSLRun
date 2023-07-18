// Define the print function
// ---------------------------------------------------------------
export default function print(){
    let str = Array.prototype.join.call(arguments, " ")
    console.log(str)
    txtAnsw.value += str + "\n"
}
window.print = print