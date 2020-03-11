package com.example.tourismcanada;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.app.SearchManager;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.provider.SearchRecentSuggestions;
import android.util.Log;
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

import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {

    private LocationsAdapter locationsAdapter;
    private RecyclerView recyclerView;
    private ArrayList<Location> locationArrayList = new ArrayList<>();
    private TextView noSearchText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        handleIntent(getIntent());
        recyclerView = findViewById(R.id.recycler_view);
        noSearchText = findViewById(R.id.no_search_text);
        LinearLayoutManager layoutManager = new LinearLayoutManager(this);
        recyclerView.setLayoutManager(layoutManager);
        locationsAdapter = new LocationsAdapter(locationArrayList);
        recyclerView.setAdapter(locationsAdapter);
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
        searchView.setSubmitButtonEnabled(false);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        if(item.getItemId() == R.id.menu_analytics){
            //call Analytics activity from here
            return true;
        }
        if(item.getItemId() == R.id.menu_orders){
            startActivity(new Intent(this, OrderHistoryActivity.class));
            return true;
        }
        if(item.getItemId() == R.id.menu_login){
            //call login activity from here
            return true;
        }
        if(item.getItemId() == R.id.menu_search){
            //onSearchRequested();
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
            locationArrayList.clear();
            noSearchText.setVisibility(View.VISIBLE);
            getApiCall(query);
        }
    }

    private void getApiCall(String query){
        try{
            //Create Instance of GETAPIRequest and call it's
            //request() method
            GetAPIRequest getapiRequest=new GetAPIRequest();
            String url="search/"+query;
            getapiRequest.request(MainActivity.this, fetchSearchResultListener, url);
            Toast.makeText(MainActivity.this,"GET API called",Toast.LENGTH_SHORT).show();
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    //Implementing interfaces of FetchDataListener for GET api request
    FetchDataListener fetchSearchResultListener=new FetchDataListener() {
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
                        Log.d("Gaurav: ", " " + jsonArray.length());
                        if(jsonArray.length() > 0) {
                            for(int i = 0; i < jsonArray.length(); i++) {
                                JSONObject jobj = jsonArray.getJSONObject(i);
                                int id = jobj.getInt("id");
                                String address = jobj.getString("address");
                                String description = jobj.getString("description");
                                String highlights = jobj.getString("highlights");
                                String image = jobj.getString("image");
                                String name = jobj.getString("name");
                                String price = jobj.getString("price");
                                locationArrayList.add(new Location(id, name, address, description, highlights, price, image));
                            }
                            noSearchText.setVisibility(View.INVISIBLE);
                        } else {
                            noSearchText.setVisibility(View.VISIBLE);
                        }
                        locationsAdapter.notifyDataSetChanged();
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
