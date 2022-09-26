import {quad, defaultGraph, namedNode, blankNode, literalLang, literalType} from '../RDF/index.js';
import {Turtle, TriG, NTriples, NQuads} from '../N3/index.js';
import N3 from 'n3';
const { namedNode, blankNode, literal, defaultGraph, quad } = N3.DataFactory;

export const parseImpl = base => format => input => function() {
   let formatString;
   switch(format) {
      case Turtle.value:
         formatString = 'turtle';
         break;
      case TriG.value:
         formatString = 'trig';
         break;
      case NTriples.value:
         formatString = 'ntriples';
         break;
      case NQuads.value:
         formatString = 'nquads';
         break;
   }
   return parse(input, formatString, base);
}

const parse = function(input, format, base) {
   return new Promise((resolve) => {
      const quads = [];
      console.log(format)
      const parser = new N3.Parser({
         format: format,
         baseIRI: base
      });

      parser.parse(input,
      (_, q) => {
         if (q) {
            let subject;
            switch(q.subject.termType) {
               case 'NamedNode':
                  subject = namedNode(q.subject.value);
                  break;
               case 'BlankNode':
                  subject = blankNode(q.subject.value);
                  break;
               case 'Literal':
                  if(q.subject.language != "") {
                     subject = literalLang(q.subject.value, q.subject.language);
                  } else {
                     subject = literalType(q.subject.value, namedNode(q.subject.datatype.value));
                  }
                  break;
            }
            let predicate;
            switch(q.predicate.termType) {
               case 'NamedNode':
                  predicate = namedNode(q.predicate.value);
                  break;
               case 'BlankNode':
                  predicate = blankNode(q.predicate.value);
                  break;
               case 'Literal':
                  if(q.predicate.language != "") {
                     predicate = literalLang(q.predicate.value, q.predicate.language);
                  } else {
                     predicate = literalType(q.predicate.value, namedNode(q.predicate.datatype.value));
                  }
                  break;
            }
            let object;
            switch(q.object.termType) {
               case 'NamedNode':
                  object = namedNode(q.object.value);
                  break;
               case 'BlankNode':
                  object = blankNode(q.object.value);
                  break;
               case 'Literal':
                  if(q.object.language != "") {
                     object = literalLang(q.object.value, q.object.language);
                  } else {
                     object = literalType(q.object.value, namedNode(q.object.datatype.value));
                  }
                  break;
            }
            let graph;
            switch(q.graph.termType) {
               case 'NamedNode':
                  graph = namedNode(q.graph.value);
                  break;
               case 'DefaultGraph':
                  graph = defaultGraph
                  break;
            }

            quads.push(quad(subject)(predicate)(object)(graph));
         } else {
            resolve(quads);
         }
      });
   });
}

export const writeImpl = base => format => input => function() {
   console.log(format)
   console.log(Turtle.format)
   let formatString;
   switch(format) {
      case Turtle.value:
         formatString = 'turtle';
         break;
      case TriG.value:
         formatString = 'trig';
         break;
      case NTriples.value:
         formatString = 'ntriples';
         break;
      case NQuads.value:
         formatString = 'nquads';
         break;
   }
   console.log(formatString)
   return write(input, formatString, base);
}

const write = function(input, format, base) {
   console.log(format)
   return new Promise((resolve) => {
      const writer = new N3.Writer({
         format: format,
         baseIRI: base
      });

      const jsQuads = [];
      for(let q of input) {
         let subject;
         switch(q.value0.constructor.name) {
            case "NamedNode":
               subject = namedNode(q.value0.value0);
               break;
            case "BlankNode":
               subject = blankNode(q.value0.value0);
               break;
            case "LiteralLang":
               subject = literal(q.value0.value0, q.value0.value1);
               break;
            case "LiteralType":
               subject = literal(q.value0.value0, q.value0.value1);
               break;
         }
         let predicate;
         switch(q.value1.constructor.name) {
            case "NamedNode":
               predicate = namedNode(q.value1.value0);
               break;
            case "BlankNode":
               predicate = blankNode(q.value1.value0);
               break;
            case "LiteralLang":
               predicate = literal(q.value1.value0, q.value1.value1);
               break;
            case "LiteralType":
               predicate = literal(q.value1.value0, q.value1.value1);
               break;
         }
         let object;
         switch(q.value2.constructor.name) {
            case "NamedNode":
               object = namedNode(q.value2.value0);
               break;
            case "BlankNode":
               object = blankNode(q.value2.value0);
               break;
            case "LiteralLang":
               object = literal(q.value2.value0, q.value2.value1);
               break;
            case "LiteralType":
               object = literal(q.value2.value0, q.value2.value1);
               break;
         }
         let graph;
         switch(q.value3.constructor.name) {
            case "NamedNode":
               graph = namedNode(q.value3.value0);
               break;
            case "DefaultGraph":
               graph = defaultGraph();
               break;
         }
         writer.addQuad(quad(subject, predicate, object, graph));
      }

      writer.end((_, result) => resolve(result))
   });
}