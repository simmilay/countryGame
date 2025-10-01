/*  REST Countries API'sinden tüm ülkeleri çek
Nüfusu 50 milyondan fazla olan ülkeleri filtrele
Bu ülkeleri alfabetik sıraya göre sırala
Sonuçları konsola yazdır 



async function getCountry() {
  const countries = await getData();

  if (countries && countries.length > 0) {
    const populations = countries.filter((country) => {
      return country.population >= 50000000;
    });

    console.log(
      "Nüfusu 50.000.000 dan fazla olan",
      populations.length,
      "ülke bulundu "
    );
    console.log("type" ,typeof populations);
     

    const allCountry = populations.forEach(element => {
        console.log(element.name.common);
        
    });
  }else{
     console.log("Ülke verileri alınamadı.");       
  }
}

getCountry();
 */

async function getData() {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=cca2,name,capital,population,flags"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error", error);
    return [];
  }
}

async function getCountry() {
  const country = getData();

  if (country && country.length > 0) {
    const countryList = country.Math.floor(Math.random() * country.length)
      .slice(0, 10)
      .forEach((element) => {
        element.name.common ;   
      });
  }
}
