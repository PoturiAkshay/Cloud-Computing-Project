package com.example.tourismcanada;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.app.SearchManager;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.provider.SearchRecentSuggestions;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.SearchView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

public class MainActivity extends AppCompatActivity {

    private TextView resultTextView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        resultTextView  = (TextView)findViewById(R.id.resultTextView);
        handleIntent(getIntent());
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater menuInflater = getMenuInflater();
        menuInflater.inflate(R.menu.menu_search, menu);
        SearchManager searchManager = (SearchManager) getSystemService(Context.SEARCH_SERVICE);
        MenuItem searchItem = menu.findItem(R.id.menu_search);
        SearchView searchView = (SearchView) searchItem.getActionView();
        assert searchManager != null;
        searchView.setSearchableInfo(searchManager.getSearchableInfo(getComponentName()));
        searchView.setIconifiedByDefault(false);
        searchView.setSubmitButtonEnabled(true);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        if(item.getItemId() == R.menu.menu_search){
            onSearchRequested();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        setIntent(intent);
        handleIntent(intent);
    }

    private void handleIntent(Intent intent) {
        if (Intent.ACTION_SEARCH.equals(intent.getAction())) {
            String query = intent.getStringExtra(SearchManager.QUERY);
            SearchRecentSuggestions suggestions = new SearchRecentSuggestions(this,
                    SearchSuggestionProvider.AUTHORITY, SearchSuggestionProvider.MODE);
            suggestions.saveRecentQuery(query, null);
            getApiCall(query);
        }
    }

    private void getApiCall(String query){
        try{
            //Create Instance of GETAPIRequest and call it's
            //request() method
            GetAPIRequest getapiRequest=new GetAPIRequest();
            String url="search/"+query;
            getapiRequest.request(MainActivity.this,fetchGetResultListener,url);
            Toast.makeText(MainActivity.this,"GET API called",Toast.LENGTH_SHORT).show();
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    //Implementing interfaces of FetchDataListener for GET api request
    FetchDataListener fetchGetResultListener=new FetchDataListener() {
        @Override
        public void onFetchComplete(JSONObject data) {
            //Fetch Complete. Now stop progress bar  or loader
            //you started in onFetchStart
            RequestQueueService.cancelProgressDialog();
            try {
                //Now check result sent by our GETAPIRequest class
                if (data != null) {
                    if (data.has("items")) {
                        JSONArray jsonArray = data.getJSONArray("items");
                        if(jsonArray!=null) {
                            //Display the result
                            //Or, You can do whatever you need to
                            //do with the JSONObject
                            resultTextView.setText(jsonArray.toString(4));
                        }
                    }
                } else {
                    RequestQueueService.showAlert("Error! No data fetched", MainActivity.this);
                }
            }catch (Exception e){
                RequestQueueService.showAlert("Something went wrong", MainActivity.this);
                e.printStackTrace();
            }
        }

        @Override
        public void onFetchFailure(String msg) {
            RequestQueueService.cancelProgressDialog();
            //Show if any error message is there called from GETAPIRequest class
            RequestQueueService.showAlert(msg,MainActivity.this);
        }

        @Override
        public void onFetchStart() {
            //Start showing progressbar or any loader you have
            RequestQueueService.showProgressDialog(MainActivity.this);
        }
    };
}
