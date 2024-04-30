import React, { useEffect, useState } from 'react';
import { RiFileCopyLine } from 'react-icons/ri'; // Import the copy icon from react-icons

function App() {
  const [options, setOptions] = useState([]);
  const [to, setTo] = useState('en');
  const [from, setFrom] = useState('en');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false); // State to track whether the output is copied

  useEffect(() => {
    fetch("https://libretranslate.com/languages")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setOptions(data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setError("Failed to fetch languages.");
      });
  }, []);

  const translate = () => {
    const url = 'https://libretranslate.de/translate';
    const apiKey = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

    const formData = new URLSearchParams();
    formData.append('q', input);
    formData.append('source', from);
    formData.append('target', to);
    formData.append('api_key', apiKey);

    fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to translate text.');
        }
        return res.json();
      })
      .then(data => {
        setOutput(data.translatedText);
        setError(null); // Reset error state on successful translation
        setCopied(false); // Reset copied state when new output is generated
      })
      .catch(error => {
        console.error("Translation error:", error);
        setError("Failed to translate text.");
      });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
      .then(() => {
        console.log('Output copied to clipboard');
        setCopied(true); // Set copied state to true after successful copy
      })
      .catch(err => {
        console.error('Failed to copy output to clipboard:', err);
        // Optionally you can handle errors here
      });
  };

  return (
    <div className='App'>
      <div className='bg-black select'>
        From ({from}):
        <select name="" id="" onChange={e => setFrom(e.target.value)}>
          {options.map(option => (
            <option value={option.code} key={option.code}>{option.name}</option>
          ))}
        </select>
        <span style={{ marginLeft: "30px" }}>  To ({to}):</span>
        <select name="" id="" onChange={e => setTo(e.target.value)}>
          {options.map(option => (
            <option value={option.code} key={option.code}>{option.name}</option>
          ))}
        </select>
      </div>
      <div className='text'>
        <textarea name="" id="" cols="50" rows="13" onInput={(e) => setInput(e.target.value)} className='input'></textarea>
        <div style={{ position: 'relative' }}>
          <textarea name="" id="" cols="50" rows="13" value={output} className='input copy'></textarea>
          {!copied && output && (
            <button className="copy-btn" onClick={copyToClipboard}>
              <RiFileCopyLine /> Copy Output
            </button>
          )}
          {copied && (
            <span className="copied-text">Copied!</span>
          )}
        </div>
      </div>
      {error && <div>Error: {error}</div>}
      <div>
        <button onClick={translate}>Translate</button>
      </div>
      
<p>Created with ❤️ by Bhavika Shinde</p>


    </div>
  );
}

export default App;
