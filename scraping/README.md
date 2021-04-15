# Scrapping
In order to obtain all the data, we do scrapping of <https://directori.upc.edu>  

The script returns a JSON with the information about the professor, following the next structure:

```
{

   "id": 2,
  
   "nom": "Nom Professorat",
  
   "img": "foto",
  
   "mail": "correu@upc.edu",
  
   "despatx": "00-00",
  
   "consultes": [
   
     "Dilluns 00:00-00:00",
    
     "Dimecres 00:00-00:00"
    
   ]
  
}
```

The URL (or the ID) of the professor is still needed.
