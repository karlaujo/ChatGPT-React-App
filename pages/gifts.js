import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGifts} from '@fortawesome/free-solid-svg-icons'
import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

const element = <FontAwesomeIcon icon="fas fa-gifts" size="6x" />

export default function Home() {
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [hobbies, setHobbies] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();

    if (loading){
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/generate-gifts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceMin, priceMax, gender, age, hobbies }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result.replaceAll("\n", "<br />"));
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert("Failed to generate gift ideas");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/gift.webp" />
      </Head>

      <main className={styles.main}>
        <h3>Christmas Gift Generator 🎁🎄</h3>
        <form onSubmit={onSubmit}>
          <label>Gender</label>
          <select
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="man">Man</option>
            <option value="woman">Woman</option>
            <option value="person">Other</option>
          </select>

          <label>Age</label>
          <input
            type="number"
            name="age"
            placeholder="Enter age"
            value={age}
            onChange={(e) => setAge(Number.parseInt(e.target.value))}
          />

          <label>Minimum Price</label>
          <input
            type="number"
            min={1}
            name="priceMin"
            placeholder="Enter the minimum Price"
            value={priceMin}
            onChange={(e) => setPriceMin(Number.parseInt(e.target.value))}
          />

          <label>Maximum Price</label>
          <input
            type="number"
            name="priceMax"
            placeholder="Enter the maximum Price"
            value={priceMax}
            onChange={(e) => setPriceMax(Number.parseInt(e.target.value))}
          />

          <label>Hobbies</label>
          <input
            type="text"
            name="hobbies"
            placeholder = "Enter hobbies"
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
          />

          <input type="submit" value="Generate gifts" />
        </form>

        {loading && (
          <div>
            <h3>Searching for the best gift ideas!</h3>
            <img src="/oh-thinking.gif" className={styles.loading }/>
          </div>
        )}

        {result && (
          <div 
            className={styles.result} 
            dangerouslySetInnerHTML={{ __html: result }}
          />
        )}
      </main>
    </div>
  );
}
