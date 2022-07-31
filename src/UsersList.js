import React from "react";
import ReactDOM from 'react-dom/client';
import reactToWebComponent from "react-to-webcomponent";

export default class UsersList extends React.Component {
    state = {
        originalData: [],
        data: [],
        searchString: ''
    };

    onKeyDown = (event) => {
        if (event.keyCode === 8) {
            this.resetState(event);
        }
    };

    resetState = (event) => {
        this.setState(
            {
                data: this.state.originalData.filter(user => user.name.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1)
            }
        );
    }
    handleChange = event => {
        if (event && event.target) {
            this.resetState(event);
        }
    };

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network error');
                };
                return response.json();
            })
            .then(userData => {
                console.log(userData)
                this.setState(() => {
                    return { data: userData, originalData: userData }
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    render() {
        const styles = `
            * {
            font-size: 1em;
            }

            .simple-table {
                border: solid 1px #DDEEEE;
                border-collapse: collapse;
                border-spacing: 0;
                font: normal 13px Arial, sans-serif;
            }
            .simple-table thead th {
                background-color: #DDEFEF;
                border: solid 1px #DDEEEE;
                color: #336B6B;
                padding: 10px;
                text-align: left;
                text-shadow: 1px 1px 1px #fff;
            }
            .simple-table tbody td {
                border: solid 1px #DDEEEE;
                color: #333;
                padding: 10px;
                text-shadow: 1px 1px 1px #fff;
            }
            .message {
                font-size: 1.5rem;
                padding:50px;
            }
        `;
        return (
        <div>
            <style>{styles}</style>
            <div>
                <input type="text" onChange={this.handleChange} onInput={this.handleChange} defaultValue={this.state.searchString} placeholder="Filter by Name"/>
            </div>
            <br></br>
        <table className="simple-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
            </tr>
            </thead>
        <tbody>
        {((this.state.data.length === 0) ? <tr><td colspan="2"><span className="message"> No results found!</span></td></tr> : 
            this.state.data.map(user => {
                return(
                    <tr key={user.id}><td>{user.name}</td><td>{user.email}</td></tr>
                )
            })
        )}
        </tbody>
        </table>
        </div>);
    }
}

customElements.define(
  "users-list",
  reactToWebComponent(UsersList, React, ReactDOM)
);
