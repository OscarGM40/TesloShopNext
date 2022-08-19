export const format = (value:number) => {
  //  crear formateador.Ojo que Intl.NumberFormat devuelve un string
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    // siempre mostraré,minimo 2 y maximo 2,o sea siempre serán 2
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return formatter.format(value); // esto ya devuelve $2,500.00
}

