function MyApp({ Component, pageProps }) {
    return <Provider {...providerFunctions,...pageProps, ...}><Template/><Banner/></Provider>
}

function Template({props}) {
    const initialProperty = {
        a:"",
        b:"",
    }
    props.providerFunctions.accept({
        template: {
            actions:(),
            props:initialProperty,
        }
    })
    return <ChildTemplate></ChildTemplate>
}
