(() => {
    if (!("showSaveFilePicker" in window)) {
        alert("window.showSaveFilePicker is not implemented.")
        document.querySelectorAll("#form input").forEach(elem => {
            elem.disabled = true
        })
        return false
    }

    const showSaveFilePicker = window.showSaveFilePicker

    class FileNotSelectedException extends Error {
    }

    document.getElementById("btn-copy").addEventListener("click", async (evt) => {
        evt.preventDefault()

        let writable
        try {
            const elementById = document.getElementById("input-file");
            if (!elementById.value) {
                // noinspection ExceptionCaughtLocallyJS
                throw new FileNotSelectedException()
            }
            const saveFilePicker = await showSaveFilePicker({
                startIn: "downloads",
                suggestedName: elementById.value.split('\\').pop(),
            })
            writable = await saveFilePicker.createWritable()
        } catch (e) {
            if (e instanceof DOMException) {
                console.warn(e)
                return false
            }
            if (e instanceof FileNotSelectedException) {
                alert("File is not specified.")
                return false
            }
            alert("An error occurred. Please check console.")
        }
        if (!writable) {
            return false
        }

        let ok
        try {
            const form = document.getElementById("form")
            await fetch(form.action, {
                method: "POST",
                body: new FormData(form)
            }).then(async r => {
                await writable.write(await r.blob())
                ok = true
            }).catch(reason => {
                console.error(reason)
                alert("An error occurred. Please check console.")
            })
        } finally {
            await writable.close()
        }
        if (ok) {
            alert("Succeeded to copy a file!")
        }
    })
})()
