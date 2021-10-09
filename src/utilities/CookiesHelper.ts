

export const CACHE_EXPIRY_DEFAULT: number = 3


export class Cookie {
    key: string;
    value: string;

    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }

    getKey() {
        return this.key;
    }
    
    getValue() {
        return Number(this.value);
    }


}



export function getCookie(key: string): Cookie | null {
    let name = key + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        const cookieValue = c.substring(name.length, c.length);
        console.log(`cache HIT [${key}] : ${cookieValue}`)
        return new Cookie(key, cookieValue)
      }
    }
    console.log(`cache MISS [${key}]`)
    return null;
}



export function setCookie(key: string, value: string, hoursTillExpire: number | undefined = CACHE_EXPIRY_DEFAULT) {
    const d = new Date();
    d.setTime(d.getTime() + (hoursTillExpire*60*60*1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = key + "=" + value + ";" + expires + ";path=/";
}