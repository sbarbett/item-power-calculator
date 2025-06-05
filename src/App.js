import React, { useState } from "react";
import "./App.css";

// Tooltip helper
const Tooltip = ({ text }) => (
  <span style={{
    display: 'inline-block',
    marginLeft: 4,
    color: '#888',
    cursor: 'help',
    fontWeight: 700,
    fontSize: '0.9em',
    borderRadius: '50%',
    border: '1px solid #bbb',
    width: 15,
    height: 15,
    textAlign: 'center',
    lineHeight: '13px',
    background: '#f3f4f6',
    verticalAlign: 'middle',
  }} title={text}>?</span>
);

export default function App() {
  // Common stats
  const [hr, setHr] = useState(0);
  const [dr, setDr] = useState(0);
  const [str, setStr] = useState(0);
  const [dex, setDex] = useState(0);
  const [con, setCon] = useState(0);
  const [intell, setIntell] = useState(0);
  const [wis, setWis] = useState(0);
  const [cha, setCha] = useState(0);
  const [hp, setHp] = useState(0);
  const [mana, setMana] = useState(0);
  const [move, setMove] = useState(0);

  // Resistances
  const [genericResistCount, setGenericResistCount] = useState(0);
  const [specificResists, setSpecificResists] = useState({
    resist_bash: false,
    resist_pierce: false,
    resist_slash: false,
    resist_fire: false,
    resist_negative: false,
    resist_acid: false,
    resist_cold: false,
    resist_holy: false,
    resist_mental: false,
    resist_lightning: false,
    resist_poison: false,
  });

  // Spellaffect and spellcast
  const [spellaffectCount, setSpellaffectCount] = useState(0);
  const [spellcastCount, setSpellcastCount] = useState(0);

  // Meta-stats (raw values)
  const [critChanceRaw, setCritChanceRaw] = useState(0);
  const [critDamageRaw, setCritDamageRaw] = useState(0);
  const [penetrationRaw, setPenetrationRaw] = useState(0);
  const [recuperationRaw, setRecuperationRaw] = useState(0);
  const [concentrationRaw, setConcentrationRaw] = useState(0);
  const [enduranceRaw, setEnduranceRaw] = useState(0);
  const [prosperityRaw, setProsperityRaw] = useState(0);

  // Item type
  const [itemType, setItemType] = useState("weapon");

  // Weapon-only stats
  const [numDice, setNumDice] = useState(0);
  const [diceSides, setDiceSides] = useState(0);
  const [specialTypes, setSpecialTypes] = useState({
    flaming: false,
    frost: false,
    shocking: false,
    acid: false,
    vampiric: false,
    vorpal: false,
    purify: false,
    sharp: false,
    twohands: false,
    poison: false,
  });

  // Armor-only stats
  const [acValues, setAcValues] = useState({ pierce: 0, bash: 0, slash: 0, exotic: 0 });

  const handleSpecialChange = (type) => {
    setSpecialTypes({ ...specialTypes, [type]: !specialTypes[type] });
  };
  const handleResistChange = (type) => {
    setSpecificResists({ ...specificResists, [type]: !specificResists[type] });
  };

  // Sum AC for armor
  const acTotal = Object.values(acValues).reduce((sum, v) => sum + Number(v), 0);

  // Flat special-type scores (ignore implicit HR/DR)
  const specialPS =
    (specialTypes.flaming ? 10 : 0) +
    (specialTypes.frost ? 10 : 0) +
    (specialTypes.shocking ? 10 : 0) +
    (specialTypes.acid ? 10 : 0) +
    (specialTypes.vampiric ? 15 : 0) +
    (specialTypes.vorpal ? 10 : 0) +
    (specialTypes.purify ? 10 : 0) +
    (specialTypes.sharp ? 10 : 0) +
    (specialTypes.twohands ? -20 : 0) +
    (specialTypes.poison ? 10 : 0);

  // Calculate average damage if weapon
  const avgDmg =
    itemType === "weapon" && Number(numDice) > 0 && Number(diceSides) > 0
      ? Number(numDice) * ((Number(diceSides) + 1) / 2)
      : 0;

  // Meta-stat contributions
  const critChancePS = (Number(critChanceRaw) / 100) * 10;
  const critDamagePS = (Number(critDamageRaw) / 100) * 8;
  const penetrationPS = (Number(penetrationRaw) / 100) * 5;
  const recuperationPS = (Number(recuperationRaw) / 100) * 2;
  const concentrationPS = (Number(concentrationRaw) / 100) * 2;
  const endurancePS = (Number(enduranceRaw) / 100) * 2;
  const prosperityPS = (Number(prosperityRaw) / 100) * 1;

  // Replace all individual saving throws with a single saves field
  const [saves, setSaves] = useState(0);

  // Count specific resistances
  const numSpecificResistX = Object.values(specificResists).filter(Boolean).length;

  // Final Power-Score calculation (revised formula)
  const powerScore =
    Number(hr) +
    Number(dr) +
    -Number(saves) +
    (itemType === "armor" ? acTotal : 0) +
    2 * (Number(str) + Number(dex) + Number(con) + Number(intell) + Number(wis) + Number(cha)) +
    0.1 * (Number(hp) + Number(mana) + Number(move)) +
    10 * numSpecificResistX +
    15 * Number(spellaffectCount) +
    20 * Number(spellcastCount) +
    (itemType === "weapon" ? 0.5 * avgDmg : 0) +
    (itemType === "weapon" ? specialPS : 0) +
    critChancePS +
    critDamagePS +
    penetrationPS +
    recuperationPS +
    concentrationPS +
    endurancePS +
    prosperityPS;

  // Reset all fields to default values
  const resetAll = () => {
    setHr(0);
    setDr(0);
    setStr(0);
    setDex(0);
    setCon(0);
    setIntell(0);
    setWis(0);
    setCha(0);
    setHp(0);
    setMana(0);
    setMove(0);
    setSaves(0);
    setSpecificResists({
      resist_bash: false,
      resist_pierce: false,
      resist_slash: false,
      resist_fire: false,
      resist_negative: false,
      resist_acid: false,
      resist_cold: false,
      resist_holy: false,
      resist_mental: false,
      resist_lightning: false,
      resist_poison: false,
    });
    setSpellaffectCount(0);
    setSpellcastCount(0);
    setCritChanceRaw(0);
    setCritDamageRaw(0);
    setPenetrationRaw(0);
    setRecuperationRaw(0);
    setConcentrationRaw(0);
    setEnduranceRaw(0);
    setProsperityRaw(0);
    setItemType("weapon");
    setNumDice(0);
    setDiceSides(0);
    setSpecialTypes({
      flaming: false,
      frost: false,
      shocking: false,
      acid: false,
      vampiric: false,
      vorpal: false,
      purify: false,
      sharp: false,
      twohands: false,
      poison: false,
    });
    setAcValues({ pierce: 0, bash: 0, slash: 0, exotic: 0 });
  };

  return (
    <div className="app-container">
      <h2>Item Power-Level Calculator</h2>

      {/* Reset All Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button onClick={resetAll} style={{ padding: '6px 18px', borderRadius: 6, background: '#e5e7eb', border: 'none', fontWeight: 500, cursor: 'pointer' }}>
          Reset All
        </button>
      </div>

      {/* Item Type Toggle */}
      <div className="section">
        <label style={{marginRight: '1.5rem'}}>
          <input
            type="radio"
            name="itemType"
            value="weapon"
            checked={itemType === "weapon"}
            onChange={() => setItemType("weapon")}
            style={{marginRight: '0.4rem'}}
          />
          Weapon
        </label>
        <label>
          <input
            type="radio"
            name="itemType"
            value="armor"
            checked={itemType === "armor"}
            onChange={() => setItemType("armor")}
            style={{marginRight: '0.4rem'}}
          />
          Armor
        </label>
      </div>

      {/* Weapon-only fields */}
      {itemType === "weapon" && (
        <div className="section stats-grid" style={{ alignItems: 'end', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr)) 140px' }}>
          <label>
            Number of Dice
            <input
              type="number"
              value={numDice}
              onChange={(e) => setNumDice(e.target.value)}
            />
          </label>
          <label>
            Sides per Die
            <input
              type="number"
              value={diceSides}
              onChange={(e) => setDiceSides(e.target.value)}
            />
          </label>
          {/* Average Damage Box with tooltip */}
          <div style={{ gridColumn: '3 / span 1', alignSelf: 'center', marginLeft: 8, fontWeight: 500, color: '#2563eb', background: '#f3f4f6', borderRadius: 6, padding: '8px 12px', minWidth: 110, textAlign: 'center' }}>
            Avg Damage <Tooltip text="+0.5 × AvgDamage" />:<br />
            <span style={{ fontSize: '1.1em', fontWeight: 600 }}>{avgDmg}</span>
          </div>
        </div>
      )}

      {/* Common HR/DR fields and AC for armor */}
      <div className="section stats-grid">
        <label>
          Hit Roll (HR) <Tooltip text="+1 per HR" />
          <input
            type="number"
            value={hr}
            onChange={(e) => setHr(e.target.value)}
          />
        </label>
        <label>
          Damage Roll (DR) <Tooltip text="+1 per DR" />
          <input
            type="number"
            value={dr}
            onChange={(e) => setDr(e.target.value)}
          />
        </label>
        {itemType === "armor" && (
          <>
            <label>
              AC Pierce <Tooltip text="+10 if checked" />
              <input
                type="number"
                value={acValues.pierce}
                onChange={(e) => setAcValues({ ...acValues, pierce: e.target.value })}
              />
            </label>
            <label>
              AC Bash <Tooltip text="+10 if checked" />
              <input
                type="number"
                value={acValues.bash}
                onChange={(e) => setAcValues({ ...acValues, bash: e.target.value })}
              />
            </label>
            <label>
              AC Slash <Tooltip text="+10 if checked" />
              <input
                type="number"
                value={acValues.slash}
                onChange={(e) => setAcValues({ ...acValues, slash: e.target.value })}
              />
            </label>
            <label>
              AC Exotic <Tooltip text="+10 if checked" />
              <input
                type="number"
                value={acValues.exotic}
                onChange={(e) => setAcValues({ ...acValues, exotic: e.target.value })}
              />
            </label>
          </>
        )}
        {/* Saves */}
        <label>
          Saves <Tooltip text="Negative adds to PS, positive subtracts from PS" />
          <input
            type="number"
            value={saves}
            onChange={(e) => setSaves(e.target.value)}
          />
        </label>
        {/* Attributes */}
        <label>
          Str <Tooltip text="+2 per STR" />
          <input
            type="number"
            value={str}
            onChange={(e) => setStr(e.target.value)}
          />
        </label>
        <label>
          Dex <Tooltip text="+2 per Dex" />
          <input
            type="number"
            value={dex}
            onChange={(e) => setDex(e.target.value)}
          />
        </label>
        <label>
          Con <Tooltip text="+2 per Con" />
          <input
            type="number"
            value={con}
            onChange={(e) => setCon(e.target.value)}
          />
        </label>
        <label>
          Int <Tooltip text="+2 per Int" />
          <input
            type="number"
            value={intell}
            onChange={(e) => setIntell(e.target.value)}
          />
        </label>
        <label>
          Wis <Tooltip text="+2 per Wis" />
          <input
            type="number"
            value={wis}
            onChange={(e) => setWis(e.target.value)}
          />
        </label>
        <label>
          Cha <Tooltip text="+2 per Cha" />
          <input
            type="number"
            value={cha}
            onChange={(e) => setCha(e.target.value)}
          />
        </label>
        {/* HP / Mana / Move */}
        <label>
          HP <Tooltip text="+0.1 per HP" />
          <input
            type="number"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
          />
        </label>
        <label>
          Mana <Tooltip text="+0.1 per Mana" />
          <input
            type="number"
            value={mana}
            onChange={(e) => setMana(e.target.value)}
          />
        </label>
        <label>
          Move <Tooltip text="+1 per Move" />
          <input
            type="number"
            value={move}
            onChange={(e) => setMove(e.target.value)}
          />
        </label>
      </div>

      {/* Resistances */}
      <div className="section">
        <div className="special-types" style={{marginTop: '1rem'}}>
          <span style={{fontWeight: 500, marginRight: 8}}>Specific Resistances:</span>
          {Object.keys(specificResists).map((type) => (
            <label key={type}>
              <input
                type="checkbox"
                checked={specificResists[type]}
                onChange={() => handleResistChange(type)}
              />
              {type.replace('resist_', '').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} <Tooltip text="+10 if checked" />
            </label>
          ))}
        </div>
      </div>

      {/* Spellaffect and Spellcast */}
      <div className="section stats-grid">
        <label>
          Spellaffect Count <Tooltip text="+15 per spellaffect" />
          <input
            type="number"
            value={spellaffectCount}
            onChange={(e) => setSpellaffectCount(e.target.value)}
          />
        </label>
        <label>
          Spellcast Count <Tooltip text="+20 per spellcast" />
          <input
            type="number"
            value={spellcastCount}
            onChange={(e) => setSpellcastCount(e.target.value)}
          />
        </label>
      </div>

      {/* Special Types (only for weapons) */}
      {itemType === "weapon" && (
        <div className="section special-types">
          <p className="font-medium mb-1">Special Types:</p>
          {Object.keys(specialTypes).map((type) => (
            <label key={type}>
              <input
                type="checkbox"
                checked={specialTypes[type]}
                onChange={() => handleSpecialChange(type)}
              />
              {type.charAt(0).toUpperCase() + type.slice(1)} <Tooltip text={type === "twohands" ? "-20 PS (requires both hands)" : type === "vampiric" ? "+15 PS" : "+10 PS"} />
            </label>
          ))}
        </div>
      )}

      {/* Meta-stats fields */}
      <div className="section meta-stats-grid">
        <label>
          Crit Chance (raw) <Tooltip text="+10 × (raw/100)" />
          <input
            type="number"
            value={critChanceRaw}
            onChange={(e) => setCritChanceRaw(e.target.value)}
          />
        </label>
        <label>
          Crit Damage (raw) <Tooltip text="+8 × (raw/100)" />
          <input
            type="number"
            value={critDamageRaw}
            onChange={(e) => setCritDamageRaw(e.target.value)}
          />
        </label>
        <label>
          Penetration (raw) <Tooltip text="+5 × (raw/100)" />
          <input
            type="number"
            value={penetrationRaw}
            onChange={(e) => setPenetrationRaw(e.target.value)}
          />
        </label>
        <label>
          Recuperation (raw) <Tooltip text="+2 × (raw/100)" />
          <input
            type="number"
            value={recuperationRaw}
            onChange={(e) => setRecuperationRaw(e.target.value)}
          />
        </label>
        <label>
          Concentration (raw) <Tooltip text="+2 × (raw/100)" />
          <input
            type="number"
            value={concentrationRaw}
            onChange={(e) => setConcentrationRaw(e.target.value)}
          />
        </label>
        <label>
          Endurance (raw) <Tooltip text="+2 × (raw/100)" />
          <input
            type="number"
            value={enduranceRaw}
            onChange={(e) => setEnduranceRaw(e.target.value)}
          />
        </label>
        <label>
          Prosperity (raw) <Tooltip text="+1 × (raw/100)" />
          <input
            type="number"
            value={prosperityRaw}
            onChange={(e) => setProsperityRaw(e.target.value)}
          />
        </label>
      </div>

      {/* Display the computed Power Score */}
      <div className="result">
        Calculated Power Score:<br />
        {powerScore.toFixed(2)}
      </div>
    </div>
  );
}
