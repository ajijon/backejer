export interface IUsuario{   //es un arreglo, una interfaz: es un contrato de lo que debe de llenar el usuario
    role: string,           //string: es un conjunto de caracteres
    nombre: string,         //nombre: es un objeto y no una variable porque no se esta declarando
    apellido: string,
    email: string,
    password: string
}