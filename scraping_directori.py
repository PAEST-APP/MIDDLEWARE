#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from  bs4 import BeautifulSoup
import requests

#1002571  XAVI
#1003202  JOSEP
DIRECTORI = 'https://directori.upc.edu/directori/dadesPersona.jsp?id='
text = ""

if __name__ == '__main__':
    #id_persona = input("Introduce la ID\n")
    URL = DIRECTORI + '1002819'#id_persona
    page = requests.get(URL)
    soup = BeautifulSoup(page.content, 'html.parser')
    name = soup.find('tr', class_='titol_persona')
    email = soup.find('span', class_= 'mail')
    email = email.text.lower()
    name_mail = email.strip()[0:email.strip().rfind("upc")]
    mail = name_mail.lower() + "@" + "upc.edu"
    info = soup.find_all('td', class_='blau2')
    for i in info:
        text += str(i.text)
    office = text[text.find("EDIFICI") + 8 : text.find("EDIFICI") + 10]
    if "DESPATX:" in text:
        office += " - " + text[text.find("DESPATX") + 9 : text.find("DESPATX") + 12] #Buscar final por "\"
    elif "DESPATX" in text:
        office += " - " + text[text.find("DESPATX") + 8 : text.find("DESPATX") + 11]
    elif "PLANTA" in text:
        office += " - " + text[text.find("PLANTA") : text.find("PLANTA") + 8]
    data = {'nombre': name.text.strip().lower(), 'correo': mail,'despacho': office}
    print(data)
    
    