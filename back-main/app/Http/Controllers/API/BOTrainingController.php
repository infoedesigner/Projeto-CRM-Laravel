<?php

namespace App\Http\Controllers\API;

require base_path('vendor'.DIRECTORY_SEPARATOR.'autoload.php');

use PHPW2V\Word2Vec;
use PHPW2V\SoftmaxApproximators\NegativeSampling;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class BOTrainingController extends Controller
{

    public function train(){

        $sentences = [
            'the fox runs fast',
            'the cat jogged fast',
            'the pug ran fast',
            'the cat runs fast',
            'the dog ran fast',
            'the pug runs fast',
            'the fox ran fast',
            'dogs are our link to paradise',
            'pets are humanizing',
            'a dog is the only thing on earth that loves you more than you love yourself',
        ];

        $dimensions     = 150; //vector dimension size
        $sampling       = new NegativeSampling; //Softmax Approximator
        $minWordCount   = 2; //minimum word count
        $alpha          = .5; //the learning rate
        $window         = 3; //window for skip-gram
        $epochs         = 1000; //how many epochs to run
        $subsample      = 0.05; //the subsampling rate


        $word2vec = new Word2Vec($dimensions, $sampling, $window, $subsample,  $alpha, $epochs, $minWordCount);
        $word2vec->train($sentences);
        $word2vec->save(public_path('bot_word2vec_model'));

    }

    public function check(){

        $word2vec = new Word2Vec();
        $word2vec = $word2vec->load(public_path('bot_word2vec_model'));

        $mostSimilar = $word2vec->mostSimilar(['the'], ['run'], 5);

        $wordEmbedding = $word2vec->wordVec('dog');

        dd($mostSimilar);

    }

}
