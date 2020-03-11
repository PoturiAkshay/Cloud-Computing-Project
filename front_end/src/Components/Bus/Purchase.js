import React from "react";

function Purchase() {
  return (
    // Navigation between different components.
    <form className="form-horizontal span6">
      <fieldset>
        <table class="table">
          <tbody>
            <tr>
              <th>Name on card</th>
              <td>
                <span className="control-group">
                  <label className="control-label">Card Holder's Name</label>

                  <input
                    type="text"
                    className="input-block-level"
                    pattern="\w+ \w+.*"
                    title="Fill your first and last name"
                    required
                  />
                </span>
              </td>
            </tr>
            <tr>
              <th>Card Number</th>
              <td>
                <span className="row-fluid">
                  <input
                    type="text"
                    className="input-block-level"
                    autoComplete="off"
                    maxLength="4"
                    pattern="\d{4}"
                    title="First four digits"
                    required
                  />

                  <input
                    type="text"
                    className="input-block-level"
                    autoComplete="off"
                    maxLength="4"
                    pattern="\d{4}"
                    title="Second four digits"
                    required
                  />

                  <input
                    type="text"
                    className="input-block-level"
                    autoComplete="off"
                    maxLength="4"
                    pattern="\d{4}"
                    title="Third four digits"
                    required
                  />

                  <input
                    type="text"
                    className="input-block-level"
                    autoComplete="off"
                    maxLength="4"
                    pattern="\d{4}"
                    title="Fourth four digits"
                    required
                  />
                </span>
              </td>
            </tr>
            <tr>
              <th>Card expiry data</th>
              <td>
                {" "}
                <span name="ced" className="row-fluid">
                  <select className="input-block-level">
                    <option>January</option>
                    <option>...</option>
                    <option>December</option>
                  </select>

                  <select className="input-block-level">
                    <option>2013</option>
                    <option>...</option>
                    <option>2015</option>
                  </select>
                </span>
              </td>
            </tr>
            <tr>
              <th>CVV</th>
              <td>
                <span className="row-fluid">
                  <input
                    type="text"
                    className="input-block-level"
                    autoComplete="off"
                    maxLength="3"
                    pattern="\d{3}"
                    title="Three digits at back of your card"
                    required
                  />
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <button type="button" className="btn">
            Cancel
          </button>
        </div>
      </fieldset>
    </form>
  );
}

export default Purchase;
