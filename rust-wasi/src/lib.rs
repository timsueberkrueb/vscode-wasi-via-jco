wit_bindgen::generate!({
    world: "hello-world",
});

struct HelloWorld;

impl Guest for HelloWorld {
    fn hello() -> i32 {
        println!("Hello, world!");
        0
    }
}

export!(HelloWorld);
