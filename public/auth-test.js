const transport = axios.create({
    baseURL: 'https://dev.kopnik.org/api/',
    withCredentials: true,
    credentials: 'include',
    headers: {
        // 'X-Custom-Header': 'foobar',
        'Content-Type': 'plain/text'
    }
});

function login_click() {
    fetch('https://dev.kopnik.org/auth-test/login?val=1234',{
        method: 'POST',
        credentials: 'include',
        headers:{
            'Content-Type': 'text/plain',
        }
    })
}

function anyMethod_click() {
/*    fetch('https://dev.kopnik.org/auth-test/any-method',{
        method: 'POST',
        credentials: 'include',
        headers:{
            'Content-Type': 'text/plain',
        }
    })*/

    transport.get('users/get')
}
