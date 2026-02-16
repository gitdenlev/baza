export async function register(name: string, email: string, password: string) {
    const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
    });
    return response.json();
}