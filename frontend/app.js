(() => {
    const $button = document.querySelector("button");
    const errorSummary = document.getElementById("error");

    $button.addEventListener("click", async () => { // asyncを追加
        // 入力値の取得
        const sepalLength = document.getElementById("sepal_length").value;
        const sepalWidth = document.getElementById("sepal_width").value;
        const petalLength = document.getElementById("petal_length").value;
        const petalWidth = document.getElementById("petal_width").value;

        const data = [sepalLength, sepalWidth, petalLength, petalWidth];
        const label = ["Sepal Length", "Sepal Width", "Petal Length", "Petal Width"];
        const Iris_labels=['setosa', 'versicolor', 'virginica']

        // 未入力項目をまとめる
        let missingFields = [];
        for (let index = 0; index < data.length; index++) {
            if (data[index] === '') {
                missingFields.push(label[index]);
            }
        }

        // エラーメッセージの表示
        if (missingFields.length > 0) {
            errorSummary.textContent = `以下の項目を入力してください: ${missingFields.join(", ")}`;
            document.getElementById("result").textContent = ""; // 結果をクリア
            document.querySelectorAll(".img img").forEach(img => {
                img.style.opacity = "0.1";
            });
        } else {
            errorSummary.textContent = ""; // エラーをクリア
        

            // FastAPIへのリクエストを送信
            const inputData = {
                sepal_length: parseFloat(sepalLength), // 数値に変換
                sepal_width: parseFloat(sepalWidth),
                petal_length: parseFloat(petalLength),
                petal_width: parseFloat(petalWidth),
            };
            console.log("Input values:", inputData);
            try {
                const response = await fetch("https://iris-backend-a4ok.onrender.com/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(inputData),
                });

                if (response.ok) {
                    const result = await response.json();
                    document.getElementById("result").textContent = `予測結果: ${Iris_labels[result.prediction]}だと思われます。`;
                    document.querySelectorAll(".img img").forEach(img => {
                        img.style.opacity = "0.1";
                    });
                    
                    document.getElementById(`${Iris_labels[result.prediction]}`).style.opacity = "1";

                } else {
                    document.getElementById("result").textContent = `エラーが発生しました: ${response.status}`;
                }
            } catch (error) {
                document.getElementById("result").textContent = `エラーが発生しました: ${error.message}`;
            }
        }
    });
})();
