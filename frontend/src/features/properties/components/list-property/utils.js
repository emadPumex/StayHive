export const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

export const readAsDataURL = (file) =>
    new Promise((res) => {
        const r = new FileReader();
        r.onload = (e) => res(e.target.result);
        r.readAsDataURL(file);
    });
